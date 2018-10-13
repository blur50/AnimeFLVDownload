const chalk = require('chalk');
const logger = (type, style) => (msg) => console.log(style(`[${type}]: ${msg}`));
module.exports.log = {
  success: logger('SUCCESS', chalk.green),
  fatal: logger('FATAL', chalk.bgRed.white),
  error: logger('ERROR', chalk.red),
  warning: logger('WARN', chalk.yellow),
  info: logger('INFO', chalk.cyan),
  debug: logger('DEBUG', chalk.gray)
};
