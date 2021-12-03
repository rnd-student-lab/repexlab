import { logSuccess, logError } from '../../utils/logger';
import { Virtstand } from '../../project/virtstand';
import { isEmpty } from 'lodash';

export const command = 'compile';
export const desc = 'Compile all VMs or a single specified VM';
export const builder = yargs =>
  yargs.option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: false,
  });

export const handler = argv => {
  run(argv.name);
};

async function run(name) {
  if (isEmpty(name)) {
    const virtstand = new Virtstand();
    await virtstand.init('./');
    await virtstand.compile();
    logSuccess(`Compiled VMs`);
  } else {
    logError(`Cannot compile specified VM '${name}'. Not implemented yet.`);
  }
}
