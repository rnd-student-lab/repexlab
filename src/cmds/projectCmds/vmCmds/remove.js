import { prompt } from 'inquirer';
import Virtstand from '../../../project/virtstand';
import { logError, logSuccess } from '../../../utils/logger';

export const command = 'remove';
export const desc = 'Remove an existing Virtual Machine configuration';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: true,
  });

export const handler = argv => {
  run(argv);
};

export async function run(argv) {
  const virtstand = new Virtstand(argv.stage);
  await virtstand.init('./');

  if (!virtstand.config.hasVM(argv.name)) {
    logError(`Virtual Machine '${argv.name}' does not exists`);
    return;
  }

  const answers = await prompt([
    {
      type: 'confirm',
      name: 'removeVM',
      message: `Do you want to remove virtual machine '${argv.name}' and all it's files?`,
      default: false,
    },
  ]);

  if (answers.removeVM) {
    await virtstand.removeVM(argv.name);
    logSuccess(`Removed the Virtual Machine '${argv.name}'`);
  }
}
