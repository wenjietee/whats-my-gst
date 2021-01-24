// app Data
const appData = {
	// user values
	myAmount: 0,
	myTotal: 0,
	myGstAmount: 0,
	myServiceChargeAmount: 0,
	// gst and service charge rates
	gstRate: 0,
	serviceCharge: 10,
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

// calculate GST , service charge
const calculateMyServiceCharge = () => {};

const calculateMyGST = () => {};

// remove last value (backspace)
const removeLastValue = () => {};

// start prog
$(() => {
	//test ajax
	ajaxGetGST();
});
