const puppeteer = require('puppeteer');
const fs = require('fs');
const https = require('https');

const index_url = 'https://animeflv.net/anime/3655/samurai-champloo';

let browser;

const downloadAnime = async () => {
  // Launch application
  console.log('Launching browser...');
  browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to anime page index
  console.log('Navigating to page...');
  await page.goto(index_url);

  // Get list of episodes
  console.log('Retrieving episode list');
  const episodeList = await getEpisodeList(page);

  // Make folder where episodes will be downloaded
  let folderName = index_url.split('/');
  folderName = folderName[folderName.length - 1];
  makeDownloadFolder(folderName);

  await startEpisodeDownload(episodeList, folderName);

  // Retrieve download options for one episode
  // Add recursivity
  // console.log('Seaching for download options');
  // const options = await goToEpisodePage(page, episodes[0]);

  // // Navigate to download page
  // console.log('Going to download page...');
  // const link = await goToDownloadPage(page, options['zippyshare']);
  // let fileName = link.split('/');
  // fileName = fileName[fileName.length -1 ];

  // // Download the episode
  // getFileData(link, `${folderName}/${fileName}`);
  console.log("DONE!")
  process.exit(0);
}

const getEpisodeList = async (page) => {
  return page.evaluate(
    () => {
      const episodeList = document.querySelectorAll('#episodeList > li > a');
      let ep = Array.from(episodeList).map(a => a.href)
      return ep.reverse();
    }
  );
};

const startEpisodeDownload = (episodeList, folderName) => {
  return new Promise(
    async (resolver, reject) => {
      // Replace i starting index for a cli parameter
      for (let i = 0; i < episodeList.length; i++) {
        await downloadEpisode(episodeList[i], folderName);
      }
      resolver();
    }
  );
}

const downloadEpisode = (episodePage, folderName) => {
  return new Promise(
    async (resolver) => {
      const page = await browser.newPage();
      const download_options = await goToEpisodePage(page, episodePage);
      const dl_link = await goToDownloadPage(page, download_options['zippyshare']);
      await page.close();
      // Download now
      await getFileData(dl_link, folderName);
      resolver();
    }
  )
}

const goToEpisodePage = async (page, destination) => {
  await page.goto(destination);
  return await getDownloadOptions(page);
}

const getDownloadOptions = async (page) => {
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

const goToDownloadPage = async (page, destination) => {
  await page.goto(destination);
  return page.evaluate(
    () => {
      const dl_button = document.querySelector('#dlbutton');
      return dl_button.href;
    }
  );
};

const makeDownloadFolder = async (name) => {
  if (!fs.existsSync(`downloads/${name}`)) {
    fs.mkdirSync(`downloads/${name}`);
  }
}

const getFileData = (link, file_dest) => {
  const fileName = link.split('/').pop();
  const route = `downloads/${file_dest}/${fileName}`;
  return new Promise(
    async (resolver, reject) => {
      const file = fs.createWriteStream(route);
      file.on('finish', () => resolver(true));
      https.get(link,
        (res) => {
          console.log("got response");
          res.pipe(file);
        }
      );
    }
  );
}


module.exports = downloadAnime;
