import { logError } from '../../utils/logger';

export const command = 'init';
export const desc = 'Initialize a new project';
export const builder = yargs => yargs;

export const handler = argv => {
  run(argv);
};

async function run() {
  logError('Not implemented yet');
}
