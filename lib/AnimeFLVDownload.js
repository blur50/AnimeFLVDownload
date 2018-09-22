const puppeteer = require('puppeteer');
const { getEpisodeList, downloadEpisodeList } = require('./episode');
const { createDownloadFolder } = require('./write');
const { log } = require('./logging');


const AnimeFLVDownload = async (indexURL) => {
  
  log.info('Starting application...');
  // Init browser
  global.animeBrowser = await puppeteer.launch();
  
  // Retrieve episode list
  const episodeList = await getEpisodeList(indexURL);

  // Check for still airing anime indexes
  if (episodeList[episodeList.length - 1].endsWith('#')) {
    episodeList.pop();
  }

  // Create download folder for episodes
  // TODO: add option to add specific download route
  const defaultFolderName = indexURL.split('/').pop();
  createDownloadFolder(defaultFolderName);

  // Begin download of episodes
  await downloadEpisodeList(episodeList, defaultFolderName);

  log.info('All done, enjoy!');
  process.exit(0);
}

module.exports = AnimeFLVDownload;
