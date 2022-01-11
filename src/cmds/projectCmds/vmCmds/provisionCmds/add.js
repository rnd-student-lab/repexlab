import { logError } from '../../../../utils/logger';

export const command = 'add';
export const desc = 'Add a new provision to the Virtual Machine configuration';
export const builder = yargs => yargs;

export const handler = argv => {
  run(argv);
};

async function run() {
  logError('Not implemented yet');
}
