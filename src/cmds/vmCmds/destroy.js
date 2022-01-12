import { isEmpty } from 'lodash';
import { logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';
import { handler as compile } from './compile';

export const command = 'destroy';
export const desc = 'Destroy all VMs or a single specified VM';
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

  const virtstand = new Virtstand(stage);
  await virtstand.init('./');
  if (isEmpty(name)) {
    await virtstand.operations.destroy();
    logSuccess('Destroyed all VMs');
  } else {
    await virtstand.operations.destroy(name);
    logSuccess(`Destroyed VM '${name}'`);
  }
}
