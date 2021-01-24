// define percentage
const PERCENT = 0.01;

// app Data
const appData = {
	// user values
	amount: 0,
	total: 0,
	gstAmount: 0,
	serviceChargeAmount: 0,
	// gst and service charge rates
	gstRate: 0,
	serviceCharge: 10,

	// methods
	calculateMyServiceCharge() {
		this.serviceChargeAmount = this.amount * (this.serviceCharge * PERCENT);
	},

	calculateMyGST() {
		this.gstAmount =
			(this.amount + this.serviceChargeAmount) * (this.gstRate * PERCENT);
	},

	calculateTotal() {
		this.total = this.amount + this.serviceChargeAmount + this.gstAmount;
	},
};

// ajax
const ajaxGetGST = () => {
	// resource ID for GST Tax rates
	const resource_id = '86841ed8-9b1e-4af4-9ecf-bc860519702c';

	$.ajax({
		// get gst from data.gov.sg
		url: `https://data.gov.sg/api/action/datastore_search?resource_id=${resource_id}`,
	}).then((data) => {
		//get current gst data
		const currentGST = data.result.records[data.result.records.length - 1];
		console.log(currentGST.tax_rate);
	}),
		() => {
			console.log('bad request');
		};
};

// remove last value (backspace)
const removeLastValue = () => {};

// start prog
$(() => {
	//test ajax
	ajaxGetGST();

	//test calculate methods
	appData.amount = 10;
	appData.gstRate = 7;

	appData.calculateMyServiceCharge();
	console.log(appData.serviceChargeAmount); // expect 1

	appData.calculateMyGST();
	console.log(appData.gstAmount); //expect 0.77

	appData.calculateTotal();
	console.log(appData.total); //expect 11.77
});
