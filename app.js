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
	calculate() {
		this.serviceChargeAmount = this.amount * (this.serviceCharge * PERCENT);
		this.gstAmount =
			(this.amount + this.serviceChargeAmount) * (this.gstRate * PERCENT);
		this.total = this.amount + this.serviceChargeAmount + this.gstAmount;
		this.allChargesAmount = this.gstAmount + this.serviceChargeAmount;
	},

	// setters
	setAmount(value) {
		this.amount = Number(value);
	},
	setGSTRate(value) {
		this.gstRate = value;
	},

	// getters
	getGSTRate() {
		return this.gstRate;
	},
	getServiceCharge() {
		return this.serviceCharge;
	},
	getTotal() {
		return this.total;
	},
	getGstChargeAmount() {
		return this.gstAmount;
	},
	getServiceChargeAmount() {
		return this.serviceChargeAmount;
	},
	getAllChargesAmount() {
		return this.allChargesAmount;
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
			app.setGSTRate(currentGSTRate);

			// display gst and service charge rate
			$('#gst-rate').text(app.getGSTRate());
			$('#svc-rate').text(app.getServiceCharge());

			// calculate event
			$('#calculate').on('click', () => {
				if ($('#amount').val()) app.setAmount($('#amount').val());
			});
		})
		.catch((error) => {
			console.log('Bad request.');
		});
});

// to limit one decimal per entry
