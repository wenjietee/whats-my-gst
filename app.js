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
	gstRate: undefined,
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
			serviceCharge: this.serviceChargeAmount.toFixed(2),
			allCharges: this.allChargesAmount.toFixed(2),
			total: this.total.toFixed(2),
		};
	},
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
			const currentGSTRate =
				data.result.records[data.result.records.length - 1].tax_rate;
			// set app with latest gst rate
			app.setGstRate(currentGSTRate);

			// display gst and service charge rate
			$('#gst-rate').text(app.getRates().gst);
			$('#svc-rate').text(app.getRates().svc);

			// calculate event
			$('#calculate').on('click', () => {
				// set amount in app object
				if ($('#amount').val()) app.setAmount($('#amount').val());

				// get checkbox values
				const $isGstChecked = $('#gst').is(':checked');
				const $isSvcChecked = $('#svc').is(':checked');

				// calculate gst svc and total
				app.calculate($isSvcChecked, $isGstChecked);

				// display calculated values
				console.log(app.getAllValues());
				// reset calcuated values
				app.resetCalculatedValues();
			});
		})
		.catch((error) => {
			console.log('Bad request.');
		});
});
