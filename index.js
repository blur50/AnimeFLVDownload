#!/usr/bin/env node
const program = require('commander');
const AnimeFLVDownload = require('./lib/AnimeFLVDownload');


program
.option('-s, --start <n>', 'Episode from which it will start the download', parseInt)
.parse(process.argv);

if(program.args[0]) {
  AnimeFLVDownload(program.args[0], program.start);
}