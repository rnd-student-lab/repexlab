import { prompt } from 'inquirer';
import { readdir } from 'fs-extra';
import { isEmpty } from 'lodash';
import Repexlab from '../../project/repexlab';
import { logError, logSuccess } from '../../utils/logger';
import { run as addVM } from './vmCmds/add';

export const command = 'init';
export const desc = 'Initialize a new project';
export const builder = yargs => yargs;

export const handler = argv => {
  run(argv);
};

async function run(argv) {
  const currentDirContent = await readdir('./');
  if (!isEmpty(currentDirContent)) {
    logError('Directory is not empty');
    return;
  }

  const repexlab = new Repexlab();
  repexlab.create('./');

  logSuccess('Initialized an empty project');

  const addNewVM = async () => {
    const answers = await prompt([
      {
        type: 'confirm',
        name: 'addVM',
        message: 'Do you want to add a new Virtual Machine to the project?',
        default: true,
      },
    ]);
    if (answers.addVM) {
      await addVM(argv);
      await addNewVM();
    }
  };
  await addNewVM();
}
