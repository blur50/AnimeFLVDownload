const { log } = require('./logging');
const { downloadEpisodeFile } = require('./write');


const getEpisodeList = async (animeIndex) => {
  const browser = global.animeBrowser;
  const page = await browser.newPage();
  await page.goto(animeIndex);
  log.info('Retrieving the episode list...');
  // var episodes is a window var in the webpage
  let episodeList = await page.evaluate(() => (episodes));
  await page.close();
  if (episodeList && episodeList.length > 0) {
    const animeName = animeIndex.split('/').pop();
    episodeList = episodeList.map(
      ep => (`https://animeflv.net/ver/${ep[1]}/${animeName}-${ep[0]}`)
    ).reverse();
    log.success('Successfully retrieved episode list!');
  } else {
    log.error('Failed to retrieve episode list...');
    log.error('Stopping application...');
    process.exit(0);
  }

  return episodeList;
};

const downloadEpisodeList = (episodeList, folderName, startingEpisode = 0) => {
  return new Promise(
    async (resolve) => {
      if (startingEpisode) startingEpisode--;
      if (startingEpisode < 0 || startingEpisode > episodeList.length) {
        log.error('Starting episode download out of range');
        process.exit(0);
      }
      log.info(`Found ${episodeList.length} episodes to download.`);
      log.info('Starting download of episodes...');
      // TODO: allow a paramater for starting index for download
      for (let i = startingEpisode; i < episodeList.length; i++) {
        log.info(`Processing episode ${i + 1}/${episodeList.length}`);
        const downloadLink = await getDownloadLink(episodeList[i]);
        await downloadEpisodeFile(downloadLink, folderName);
      }
      log.info('Finished downloading episodes...');
      resolve();
    }
  );
}

const getDownloadLink = (episodePage) => {
  return new Promise(
    async (resolve) => {
      const browser = global.animeBrowser;
      const page = await browser.newPage();
      const download_options = await getDownloadOptions(page, episodePage);
      // TODO: add download provider option on cli parameter
      const dl_link = await getDefinitiveDownloadLink(page, download_options['zippyshare']);
      await page.close();
      resolve(dl_link);
    }
  )
}

const getDownloadOptions = async (page, episodePage) => {
  await page.goto(episodePage);
  return page.evaluate(
    () => {
      const rows = document.querySelector('.RTbl').children[1].children;
      const dl_links = {};
      for(let i = 0; i < rows.length; i++) {
        const dl_prov = rows[i].children[0].innerHTML;
        const dl_link = rows[i].children[3].children[0].href;
        dl_links[dl_prov.toLowerCase()] = decodeURIComponent(dl_link.split('s=')[1]);
      }
      return dl_links;
    }
  );
};

const getDefinitiveDownloadLink = async (page, destination) => {
  await page.goto(destination);
  return page.evaluate(
    () => {
      const dl_button = document.querySelector('#dlbutton');
      return dl_button.href;
    }
  );
};

module.exports = { getEpisodeList, downloadEpisodeList };