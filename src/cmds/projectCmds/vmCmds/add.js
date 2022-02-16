import { prompt } from 'inquirer';
import { posix } from 'path';
import { IPv4 } from 'ipaddr.js';
import { isInteger } from 'lodash';
import isValidHostname from 'is-valid-hostname';

import Repexlab from '../../../project/repexlab';
import { logSuccess } from '../../../utils/logger';

export const command = 'add';
export const desc = 'Add a new Virtual Machine configuration';
export const builder = yargs => yargs;

export const handler = argv => {
  run(argv);
};

export async function run(argv) {
  const repexlab = new Repexlab(argv.stage);
  const defaultDirectory = 'vms';

  await repexlab.init('./');

  const answers = await prompt([
    {
      type: 'input',
      name: 'name',
      message: 'VM name:',
      default: 'virtualmachine',
      validate: (input) => {
        if (!isValidHostname(input)) {
          return 'Virtual Machine name must be a valid hostname';
        }
        if (repexlab.config.hasVM(input)) {
          return 'Virtual Machine with this name already exists within the project';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'box',
      message: 'Vagrant box:',
      choices: ['ubuntu/focal64', 'ubuntu/bionic64'],
    },
    {
      type: 'number',
      name: 'cpus',
      message: 'VM number of CPUs:',
      default: 1,
      validate: (input) => {
        if (!isInteger(input)) {
          return 'Must be an integer value';
        }
        if (!(input > 0)) {
          return 'Must be greater or equal to 1';
        }
        return true;
      },
    },
    {
      type: 'number',
      name: 'memory',
      message: 'VM memory (MB):',
      default: 1024,
      validate: (input) => {
        if (!isInteger(input)) {
          return 'Must be an integer value';
        }
        if (!(input > 0)) {
          return 'Must be greater or equal to 1';
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'ip',
      message: 'VM IP address:',
      validate: (input) => {
        if (!IPv4.isValidFourPartDecimal(input)) {
          return 'IP doesn\'t seem to be correct';
        }
        return true;
      },
    },
  ]);

  const config = {
    defaults: {
      box: answers.box,
      provider: {
        memory: answers.memory,
        cpus: answers.cpus,
        hostname: answers.name,
        network: {
          ip: answers.ip
        },
      }
    }
  };

  await repexlab.addVM(answers.name, posix.join(defaultDirectory, answers.name), config);

  logSuccess(`Added a new Virtual Machine '${answers.name}'`);
}
