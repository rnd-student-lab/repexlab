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
  // await compile(argv);
  await restart(argv);
  await run(argv);
};

export async function run(argv) {
  const { name, stage } = argv;

  const virtstand = new Virtstand(stage);
  await virtstand.init('./');
  if (isEmpty(name)) {
    await virtstand.operations.provision();
    logSuccess('Provisioned all VMs');
  } else {
    await virtstand.operations.provision(name);
    logSuccess(`Provisioned VM '${name}'`);
  }
}
