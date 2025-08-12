//////////////
// CONSTANTS
//////////////

// percentage expression
const PERCENT = 0.01;

// resource ID for GST Tax rates
const GST_RESOURCE_ID = '86841ed8-9b1e-4af4-9ecf-bc860519702c';

//////////////
// APP OBJECT
//////////////

const app = {
	// user values
	amount: 0,
	total: 0,
	gstAmount: 0,
	serviceChargeAmount: 0,
	allChargesAmount: 0,
	// gst and service charge rates
	gstRate: Number(localStorage.getItem('gstRate')),
	serviceCharge: 10,

	// methods
	calculate(isSvcChecked, isGstChecked) {
		// calculate service charge if checked
		if (isSvcChecked) {
			this.serviceChargeAmount =
				this.amount * (this.serviceCharge * PERCENT);
		}
		// calculate gst if checked
		if (isGstChecked) {
			this.gstAmount =
				(this.amount + this.serviceChargeAmount) *
				(this.gstRate * PERCENT);
		}
		// calculate total including all charges
		this.total = this.amount + this.serviceChargeAmount + this.gstAmount;

		// calculate charges only
		this.allChargesAmount = this.gstAmount + this.serviceChargeAmount;
	},

	resetCalculatedValues() {
		this.total = 0;
		this.gstAmount = 0;
		this.serviceChargeAmount = 0;
		this.allChargesAmount = 0;
	},

	// setters
	setAmount(value) {
		this.amount = Number(value);
	},
	setGstRate(value) {
		if (value) {
			this.gstRate = value;
			localStorage.setItem('gstRate', value);
		}
	},

	// getters
	getRates() {
		return { gst: this.gstRate, svc: this.serviceCharge };
	},

	getAllValues() {
		// returns values as strings in object
		return {
			amount: this.amount.toFixed(2),
			gst: this.gstAmount.toFixed(2),
			svc: this.serviceChargeAmount.toFixed(2),
			all: this.allChargesAmount.toFixed(2),
			total: this.total.toFixed(2),
		};
	},
};

//////////////
// HELPERS
//////////////

const copyToClipboard = (button) => {
	// get key for result object
	let resultId = $(button).attr('id').split('-')[0];

	// copy to clipboard
	navigator.clipboard.writeText(app.getAllValues()[resultId]);
};

const openModal = (buttonVal) => {
	if (buttonVal.includes('about')) {
		$('#modal-about').css('display', 'block');
		return;
	}
	if (buttonVal.includes('install')) {
		$('#modal-install').css('display', 'block');
		return;
	}
};

const closeModal = () => {
	$('#modal-about').css('display', 'none');
	$('#modal-install').css('display', 'none');
};

//////////////
// APP START
//////////////

$(async () => {
	// get gst from data.gov.sg
	const apiResponse = { data: undefined };
	try {
		apiResponse.data = await $.ajax({
			url: `https://data.gov.sg/api/action/datastore_search?resource_id=${GST_RESOURCE_ID}`,
		});
	} catch (error) {
		console.log(error.responseText);
	}
	
	// handle new GST rates
	let newGstRate = 9;
	
	// get current gst data
	const currentGstRate =
		apiResponse.data?.result.records[
			apiResponse.data.result.records.length - 1
		].tax_rate;

	// set app with latest gst rate
	app.setGstRate(Number(currentGstRate) === newGstRate? currentGstRate : newGstRate);

	// display gst and service charge rate
	const rates = app.getRates();
	$('#gst-rate').text(rates.gst);
	$('#svc-rate').text(rates.svc);

	// calculate event
	$('#calculate').on('click', () => {
		// display loader
		$('.loader').css('display', 'block');

		setTimeout(() => {
			// set amount in app object
			if ($('#amount-input').val())
				app.setAmount($('#amount-input').val());

			// get checkbox values
			let isGstChecked = $('#gst').is(':checked');
			let isSvcChecked = $('#svc').is(':checked');

			// reset calcuated values
			app.resetCalculatedValues();

			// calculate gst svc and total
			app.calculate(isSvcChecked, isGstChecked);

			// display calculated values
			const values = app.getAllValues();
			const $results = $('.result').toArray();
			$results.forEach((result) => {
				$(result).text(values[result.id]);
			});

			// hide loader
			$('.loader').css('display', 'none');
		}, 800);
	});

	// clipboard event
	$('.clipboard').on('click', (e) => {
		e.preventDefault();
		copyToClipboard(e.target);

		// notify value copied
		const $popover = $(e.target).next();
		$popover.attr('hidden', false);
		setTimeout(() => {
			$popover.attr('hidden', true);
		}, 1000);
	});

	// modal events
	$('.open').on('click', (e) => {
		e.preventDefault();
		openModal(e.target.id);
	});

	$('.close').on('click', (e) => {
		e.preventDefault();
		closeModal();
	});
});
