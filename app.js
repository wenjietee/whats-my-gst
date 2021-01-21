// object to store calculator values
const calculatorValues = {
	display: '',
	currentValue: 0,
};

// calulate the amount between 2 values via chosen operator
// const calculate = (value1, value2, operator) => {
// 	initial method
// 	switch (operator) {
// 		case '+':
// 			return value1 + value2;
// 			break;
// 		case '-':
// 			return value1 - value2;
// 			break;
// 		case '*':
// 			return value1 * value2;
// 			break;
// 		case '/':
// 			return value1 / value2;
// 			break;
// 		default:
// 			console.log('Invalid operation');
// 	}
// };

// attempting new calculate method based on eval() method
const calculate = (input) => {
	// try catch to catch errors thrown by eval() method
	try {
		calculatorValues.currentValue = eval(input);
		return calculatorValues.currentValue;
	} catch (err) {
		calculatorValues.currentValue = 'Invalid Operation!';
		return calculatorValues.currentValue;
	}
};

// clear stored value from calculatorValues
const clear = () => {
	calculatorValues.display = '';
	calculatorValues.currentValue = 0;
	$('#value').empty();
};

// start prog
$(() => {
	//init calculatorValues on display div
	$('#value').text(calculatorValues.display);

	//keypad click event
	$('.keypad').on('click', (event) => {
		$('#value').empty();
		calculatorValues.display += $(event.currentTarget).text();
		$('#value').text(calculatorValues.display);
	});

	// clear button event
	$('#clear').on('click', clear);

	// equal button event
	$('#equal').on('click', () => {
		$('#value').text(calculate(calculatorValues.display));
	});
});
