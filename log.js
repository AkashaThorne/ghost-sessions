const chalk = require('chalk');

module.exports = function log(...args) { 
	const dec = (strings) => {
		const d = chalk.hex('7289DA').bold('-');
		const c = chalk.hex('99AAB5').bold(':');
		return d + c + d + ` ${strings}\r\n`;
	}
	console.log(dec(...args)); 
}