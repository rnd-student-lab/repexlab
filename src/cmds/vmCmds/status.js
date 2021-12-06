import { logSuccess, logError, logInfo } from '../../utils/logger';
import { Virtstand } from '../../project/virtstand';
import { isEmpty } from 'lodash';
import { handler as compile } from './compile';
import { stringify } from 'yaml';

export const command = 'status';
export const desc = 'Displays current status for all VMs or a single specified VM';
export const builder = yargs =>
  yargs.option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
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
    const statuses = await virtstand.status();
    logSuccess(`VMs statuses:`);
    logInfo(stringify(statuses));
  } else {
    const statuses = await virtstand.status(name);
    logSuccess(`VM '${name}' status:`);
    logInfo(stringify(statuses));
  }
}
