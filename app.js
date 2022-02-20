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
		this.gstRate = value;
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

//////////////
// APP START
//////////////

$(() => {
	$.ajax({
		// get gst from data.gov.sg
		url: `https://data.gov.sg/api/action/datastore_search?resource_id=${GST_RESOURCE_ID}`,
	})
		.then((data) => {
			// get current gst data
			const currentGstRate =
				data.result.records[data.result.records.length - 1].tax_rate;
			// set app with latest gst rate
			app.setGstRate(currentGstRate);

			// save local storage
			localStorage.setItem('gstRate', currentGstRate);

			// display gst and service charge rate
			const rates = app.getRates();
			$('#gst-rate').text(rates.gst);
			$('#svc-rate').text(rates.svc);

			// calculate event
			$('#calculate').on('click', () => {
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
		})
		.catch((error) => {
			console.log('Bad request.');
		});
});
