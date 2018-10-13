const puppeteer = require('puppeteer');
const { getEpisodeList, downloadEpisodeList } = require('./episode');
const { createDownloadFolder } = require('./write');
const { log } = require('./logging');


const AnimeFLVDownload = async (indexURL, startingEpisode, onlyLinks, exactEpisodes) => {
  log.info('Iniciando aplicación...');
  // Init browser
  global.animeBrowser = await puppeteer.launch();
  
  // Retrieve episode list
  const episodeList = await getEpisodeList(indexURL);

  // Create download folder for episodes
  // TODO: add option to add specific download route
  const defaultFolderName = indexURL.split('/').pop();
  if (!onlyLinks) {
    createDownloadFolder(defaultFolderName);
  }

  // Begin download of episodes
  await downloadEpisodeList(episodeList, defaultFolderName, startingEpisode, onlyLinks, exactEpisodes);

  log.info('¡Todo listo! Cerrando aplicación...');
  process.exit(0);
}

module.exports = AnimeFLVDownload;
