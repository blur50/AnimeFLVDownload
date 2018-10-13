#!/usr/bin/env node
const program = require('commander');

const parseEpisodes = (parameter) => {
  return new Set(
    parameter.match(/[0-9]+/g)
    .map(
      episode => parseInt(episode, 10)
    ).sort(
      (a, b) => a - b
    )
  );
}

const validateCommand = (command) => {
  if(command.args[0]) {
    require('./lib/AnimeFLVDownload')(
      command.args[0], command.start, command.onlyLinks, command.episodes
    );
  } else {
    program.help();
  }
}

program
.version('1.0.4', '-v --version')
.usage('[options] [anime_index_page]')
.option('-s, --start <n>', 'Episodio desde el cual va a empezar la descarga', parseInt)
.option('-ol --only-links', 'En vez de descargar, muestra los links de descarga en la consola')
.option('-e --episodes <n1,n2,..n>', 'Listado de episodios elegidos para descargar e.j.: 1,2,3', parseEpisodes)
.parse(process.argv);

validateCommand(program);