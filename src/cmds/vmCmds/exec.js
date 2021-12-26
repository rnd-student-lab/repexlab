import { logError, logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';
import { handler as compile } from './compile';

export const command = 'exec';
export const desc = 'Executes a command on a single specified VM';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: true,
  })
  .option('command', {
    alias: 'c',
    string: true,
    describe: 'Command',
    requiresArg: true,
    required: true,
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
  await run(argv.name, argv.command);
};

async function run(name, cmd) {
  const virtstand = new Virtstand();
  await virtstand.init('./');
  try {
    await virtstand.exec(name, cmd);
    logSuccess(`Executed the command on VM '${name}'.`);
  } catch (error) {
    logError(`Failed to execute the command on VM '${name}'.`);
    logError(error);
  }
}
