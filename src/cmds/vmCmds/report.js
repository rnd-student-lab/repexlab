import { isEmpty } from 'lodash';
import moment from 'moment';
import { logError, logSuccess } from '../../utils/logger';
import Virtstand from '../../project/virtstand';
import { handler as compile } from './compile';

export const command = 'report';
export const desc = 'Creates a resource usage report';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: false,
  })
  .option('start', {
    string: true,
    describe: 'Timespan start time (or start stage name for task automation)',
    requiresArg: true,
    required: true,
  })
  .option('end', {
    string: true,
    describe: 'Timespan end time (or end stage name for task automation)',
    requiresArg: true,
    required: true,
  })
  .option('labels', {
    alias: 'l',
    string: true,
    array: true,
    describe: 'List of Atop labels to report (eg. CPU, MEM, DSK)',
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
  await run(argv);
};

export async function run(argv) {
  const {
    name, stage, start, end, labels
  } = argv;

  const virtstand = new Virtstand(stage);
  await virtstand.init('./');

  const timestamp = moment();
  // try {
  await virtstand.operations.report(name, timestamp.unix(), start, end, labels);
  //   if (isEmpty(name)) {
  //     logSuccess('Executed the command on all VMs.');
  //   } else {
  //     logSuccess(`Executed the command on VM '${name}'`);
  //   }
  // } catch (error) {
  //   if (isEmpty(name)) {
  //     logError('Failed to execute the command on all VMs');
  //   } else {
  //     logError(`Failed to execute the command on VM '${name}'`);
  //   }
  //   logError(error);
  // }
}
