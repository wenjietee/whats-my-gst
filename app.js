// define percentage
const PERCENT = 0.01;

// app Data
const appData = {
	//display values
	displayAmount: '',
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

	// setters
	setAmount(value) {
		this.amount = Number(value);
	},

	setGSTRate(value) {
		this.gstRate = value;
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
		// console.log(currentGST.tax_rate);
		appData.setGSTRate(currentGST);
	}),
		() => {
			console.log('bad request');
		};
};

// remove last value (backspace)
const removeLastValue = () => {};

// start prog
$(() => {
	//keypad events
	$('.keypad').on('click', (event) => {
		$('#before').empty();
		appData.displayAmount += $(event.currentTarget).text();
		$('#before').text(appData.displayAmount);
		appData.setAmount(appData.displayAmount);
	});

	// delete event
	$('#delete').on('click', (event) => {});

	//calculate event
	$('#copy').on('click', () => {});

	//copy event
	$('#calculate').on('click', () => {});

	//test ajax
	ajaxGetGST();
	console.log(appData.gstRate);
});

// to limit one decimal per entry
