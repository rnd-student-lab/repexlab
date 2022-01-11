import { logError } from '../../../utils/logger';

export const command = 'remove';
export const desc = 'Remove an existing stage from the experiment configuration';
export const builder = yargs => yargs;

export const handler = argv => {
  run(argv);
};

async function run() {
  logError('Not implemented yet');
}
