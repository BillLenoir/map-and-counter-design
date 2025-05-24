import { HexMap } from './generate-hexmap';
import { argv } from './utils/args';
import { saveToFile } from './utils/save-to-file';

switch (argv.generate) {
  case 'map':
    const hexMap = new HexMap({
      cols: argv.cols,
      rows: argv.rows,
      dpi: argv.dpi,
      hexSize: argv.hexSize,
      hexColor: argv.hexColor,
    });
    saveToFile(hexMap.generateHexMapSvg());
    break;

  default:
    console.error(`❌ Unsupported generator: ${argv.generate}`);
    process.exit(1);
}
