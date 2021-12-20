import { isEmpty } from 'lodash';
import { logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';
import { handler as compile } from './compile';
import { handler as restart } from './restart';

export const command = 'provision';
export const desc = 'Provisions all VMs or a single specified VM';
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
  // await compile(argv);
  await restart(argv);
  await run(argv.name);
};

async function run(name) {
  const virtstand = new Virtstand();
  await virtstand.init('./');
  if (isEmpty(name)) {
    await virtstand.provision();
    logSuccess('Provisioned all VMs');
  } else {
    await virtstand.provision(name);
    logSuccess(`Provisioned VM '${name}'.`);
  }
}
