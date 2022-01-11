import { logError } from '../../../utils/logger';

export const command = 'remove';
export const desc = 'Remove an existing Virtual Machine configuration';
export const builder = yargs => yargs;

export const handler = argv => {
  run(argv);
};

async function run() {
  logError('Not implemented yet');
}
