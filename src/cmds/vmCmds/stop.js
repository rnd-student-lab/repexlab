import { isEmpty } from 'lodash';
import { logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';
import { handler as compile } from './compile';

export const command = 'stop';
export const desc = 'Stops all VMs or a single specified VM';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: false,
  })
  .option('stage', {
    alias: 's',
    string: true,
    describe: 'Stage name',
    requiresArg: false,
  });

export const handler = async argv => {
  await compile(argv);
  await run(argv.name);
};

async function run(name) {
  const virtstand = new Virtstand();
  await virtstand.init('./');
  if (isEmpty(name)) {
    await virtstand.stop();
    logSuccess('Stopped all VMs');
  } else {
    await virtstand.stop(name);
    logSuccess(`Stopped VM '${name}'.`);
  }
}
