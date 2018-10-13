# AnimeFLVDownload

**Actualmente, existe solamente soporte de descarga con Zippyshare**

Una herramienta de línea de comando para descarga anime desde AnimeFLV.

Para descargar la herramienta:
```
npm -g install animeflvdownload
```
Para utilizar la herramienta:
```
$ Usage: AnimeFLVDownload [options] [anime_index_page]

Options:

  -v --version               output the version number
  -s, --start <n>            Episodio desde el cual va a empezar la descarga
  -ol --only-links           En vez de descargar, muestra los links de descarga en la consola
  -e --episodes <n1,n2,..n>  Listado de episodios elegidos para descargar e.j.: 1,2,3
  -h, --help                 output usage information
```
|Parámetro|Tipo|Descripción|Ejemplo
|-|-|-|-|
|anime_index_page|string|URL de la lista de episodios en AnimeFLV| https://animeflv.net/anime/5468/jojo-no-kimyou-na-bouken-ougon-no-kaze|
|--start|number|Episodio desde el cual se va a empezar la descarga.|5
|--only-links|boolean|Si el flag only-links se añade, no se descargaran automaticamente los episodios, sino que se mostraran los links de descarga|--only-links
|--episodes|List[number]|Un listado de numeros de episodios que se descargaran. Los episodios que no estén en esta lista serán ignorados.|4,7,22,105

