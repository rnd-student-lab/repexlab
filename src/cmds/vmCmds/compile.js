import { isEmpty } from 'lodash';
import { logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';

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
  await run(argv.name, argv.stage);
};

async function run(name, stage) {
  const virtstand = new Virtstand();
  await virtstand.init('./', stage);
  if (isEmpty(name)) {
    await virtstand.compile();
    logSuccess('Compiled all VMs');
  } else {
    await virtstand.compile(name);
    logSuccess(`Compiled VM '${name}'`);
  }
}
