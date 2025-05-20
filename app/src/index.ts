import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
  .option('generate', {
    type: 'string',
    default: 'map',
    describe: 'What to generate, map or counters?',
  })
  .option('cols', {
    type: 'number',
    default: 25,
    describe: 'Number of hexes horizontally',
  })
  .option('rows', {
    type: 'number',
    default: 28,
    describe: 'Number of hexes vertically',
  })
  .option('dpi', {
    type: 'number',
    default: 96,
    describe: 'Dots per inch',
  })
  .option('hexSize', {
    type: 'number',
    default: 1,
    describe: 'Number of inches between parallel sides',
  })
  .parse();


console.log(JSON.stringify(argv));