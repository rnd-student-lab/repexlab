import { isEmpty } from 'lodash';
import { logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';
import { handler as compile } from './compile';

export const command = 'setupHosts';
export const desc = 'Add IP-Hostname bindings to /etc/hosts to all VMs or a single specified VM';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: false,
  })
  .option('stage', {
    alias: 's',
    string: true,
    describe: 'Stage name',
    requiresArg: true,
    required: false,
  });

export const handler = async argv => {
  await compile(argv);
  await run(argv);
};

export async function run(argv) {
  const { name, stage } = argv;

  const virtstand = new Virtstand();
  await virtstand.init('./', stage);
  if (isEmpty(name)) {
    await virtstand.setupHosts();
    logSuccess('Done /etc/hosts setup for all VMs');
  } else {
    await virtstand.setupHosts(name);
    logSuccess(`Done /etc/hosts setup for VM '${name}'.`);
  }
}
