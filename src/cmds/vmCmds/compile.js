import { logSuccess, logError } from '../../utils/logger';
import { Virtstand } from '../../project/virtstand';
import { isEmpty } from 'lodash';

export const command = 'compile';
export const desc = 'Compile all VMs or a single specified VM';
export const builder = yargs =>
  yargs
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
  await run(argv.name, argv.stage);
};

async function run(name, stage) {
  const virtstand = new Virtstand();
  await virtstand.init('./', stage);
  if (isEmpty(name)) {
    await virtstand.compile();
    logSuccess(`Compiled all VMs`);
  } else {
    await virtstand.compile(name);
    logSuccess(`Compiled VM '${name}'`);
  }
}
