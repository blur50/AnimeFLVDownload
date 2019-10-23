const { log } = require('./logging');
const { downloadEpisodeFile } = require('./write');
const { wait } = require('./utils');


const getEpisodeList = async (animeIndex) => {
  const browser = global.animeBrowser;
  const page = await browser.newPage();
  await page.goto(animeIndex);
  log.info('Recuperando listado de episodios...');
  log.info('Waiting for browser redirect...');
  await wait(10000);
  let episodes = await page.evaluate(() => (window.episodes));
  await page.close();

  let episodeList = new Map();
  if (episodes && episodes.length > 0) {
    const animeName = animeIndex.split('/').pop();
    episodes.reverse().forEach(
      episode => episodeList.set(
        episode[0],
        `https://animeflv.net/ver/${episode[1]}/${animeName}-${episode[0]}`
      )
    );
    log.success('¡Lista de episodios recuperada exitosamente!');
  } else {
    log.error('¡Fallo al recuperar la lista de episodios! Cerrando aplicación...');
    process.exit(0);
  }
  return episodeList;
};

const downloadEpisodeList = (episodeList, folderName, startingEpisode = 0, onlyLinks = false, exactEpisodes = new Set()) => {
  return new Promise(
    async (resolve) => {
      let downloadList = new Map();

      log.info(`Se encontraron ${episodeList.size} episodios para descargar.`);
      log.info('Empezando la descarga de episodios...');

      // Esto se debería validar en la captura de la linea de comando
      if (exactEpisodes.size > 0) {
        exactEpisodes.forEach(
          epNumber => downloadList.set(epNumber, episodeList.get(epNumber))
        );
      } else if (startingEpisode) {
        // Take startingEpisode number, and iterate through keys until reaching -1
        for (let i = startingEpisode - 1; i > -1; i--) {
          if (episodeList.has(i)) {
            episodeList.delete(i);
          }
        }
        downloadList = episodeList;
      } else {
        downloadList = episodeList;
      }

      for (let [number, page] of downloadList) {
        log.info(`Procesando episodio n° ${number}`);
        const downloadLink = await getDownloadLink(page);
        if (onlyLinks) {
          log.success(`Link de descarga: ${downloadLink}`);
        } else {
          if (downloadLink) {
            await downloadEpisodeFile(downloadLink, folderName);
          } else {
            log.error(`Ocurrió un error al recuperar el link del episodio ${number}. El link o la página puede que no existan.`);
          }
        }
      }
      log.info('Descarga de episodios terminada...');
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
      let dl_link;
      if (download_options.zippyshare) {
        dl_link = await getDefinitiveDownloadLink(page, download_options.zippyshare);
      } else {
        log.error('¡El link de zippyshare no fue encontrado! ¯\\_(ツ)_/¯');
        dl_link = false;
      }
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
      for (let i = 0; i < rows.length; i++) {
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
      if (dl_button) {
        return dl_button.href;
      } else {
        return false;
      }
    }
  );
};

module.exports = { getEpisodeList, downloadEpisodeList };
