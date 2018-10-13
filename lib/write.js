const fs = require('fs');
const https = require('https');
const { log } = require('./logging');

const createDownloadFolder = (folderPath) => {
  if (!fs.existsSync(folderPath)) {
    log.info('Creando el directorio de descarga...');
    try {
      fs.mkdirSync(folderPath);
      log.success('¡El directorio de descarga se creo exitosamente!');
    } catch (error) {
      log.error('¡Ocurrio un error al tratar de crear el directorio de descarga!');
      log.error(error);
    }
  } else {
    log.info('El directorio de descarga ya existe...');
  }
}

const downloadEpisodeFile = (link, folderName) => {
  const fileName = link.split('/').pop();
  const filePath = `${folderName}/${fileName}`;
  return new Promise(
    async (resolve) => {
      if(fs.existsSync(filePath)) {
        log.warning('¡El archivo/episodio ya existe! Saltándose la descarga del archivo...');
        resolve();
      } else {
        const file = fs.createWriteStream(filePath);
  
        file.on('finish', () => {
          log.success(`Se terminó de descarga el archivo ${fileName}`);
          resolve();
        });
  
        file.on('error', (err) => {
          log.error(`Ocurrió un error al descargar el archivo ${fileName}`);
          log.error(err);
          // TODO: use reject instead of resolve
          resolve();
        })
  
        log.info(`Iniciando la descarga del archivo ${fileName}`);
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
