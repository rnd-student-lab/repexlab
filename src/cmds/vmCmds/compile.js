import { isEmpty } from 'lodash';
import { logSuccess } from '../../utils/logger';
import Repexlab from '../../project/repexlab';

export const command = 'compile';
export const desc = 'Compile all VMs or a single specified VM';
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
  await run(argv);
};

export async function run(argv) {
  const { name, stage } = argv;

  const repexlab = new Repexlab(stage);
  await repexlab.init('./');
  if (isEmpty(name)) {
    await repexlab.operations.compile();
    logSuccess('Compiled all VMs');
  } else {
    await repexlab.operations.compile(name);
    logSuccess(`Compiled VM '${name}'`);
  }
}
