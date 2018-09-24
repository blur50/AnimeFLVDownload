const fs = require('fs');
const https = require('https');
const { log } = require('./logging');

const createDownloadFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    log.info('Creating download folder...');
    try {
      fs.mkdirSync(folderPath);
      log.success('Successfully create download folder!');
    } catch (error) {
      log.error('Failed to create folder!');
      log.error(error);
    }
  } else {
    log.info('Folder already exists! Skipping folder creation...');
  }
}

const downloadEpisodeFile = (link, folderName) => {
  const fileName = link.split('/').pop();
  const filePath = `${folderName}/${fileName}`;
  return new Promise(
    async (resolve) => {
      if(fs.existsSync(filePath)) {
        log.warning('File/episode already exists! Skipping file download.');
        resolve();
      } else {
        const file = fs.createWriteStream(filePath);
  
        file.on('finish', () => {
          log.success(`Finished downloading file ${fileName}`);
          resolve();
        });
  
        file.on('error', (err) => {
          log.error(`Failed to download file ${fileName}`);
          log.error(err);
          // TODO: use reject instead of resolve
          resolve();
        })
  
        log.info(`Starting download of file ${fileName}`);
        https.get(link,
          (res) => {
            res.pipe(file);
          }
        );
      }
    }
  );
}

module.exports = { createDownloadFolder, downloadEpisodeFile };
