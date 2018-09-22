const chalk = require('chalk');
const logger = (style) => (msg) => console.log(style(msg));
module.exports.log = {
  success: logger(chalk.green),
  error: logger(chalk.red),
  warning: logger(chalk.yellow),
  info: logger(chalk.blue)
};
