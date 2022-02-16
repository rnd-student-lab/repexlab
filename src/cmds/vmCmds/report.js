import { isEmpty } from 'lodash';
import moment from 'moment';
import { logError, logSuccess } from '../../utils/logger';
import Repexlab from '../../project/repexlab';
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
    required: false,
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

export async function run(argv, stageTimer) {
  const {
    name, stage, start, end, labels
  } = argv;

  const repexlab = new Repexlab(stage);
  await repexlab.init('./');

  const now = moment();
  let startTime;
  let endTime;

  if (stageTimer) { // Running inside the task automation
    startTime = stageTimer.get(start, 'start').format('HH:mm:ss');
    endTime = end ? stageTimer.get(end, 'end').format('HH:mm:ss') : now.format('HH:mm:ss');
  } else { // Running inside CLI call
    startTime = start;
    endTime = end || now.format('HH:mm:ss');
  }

  try {
    await repexlab.operations.report(name, now.unix(), startTime, endTime, labels);

    if (isEmpty(name)) {
      logSuccess('Created reports on all VMs.');
    } else {
      logSuccess(`Created a report on VM '${name}'`);
    }
  } catch (error) {
    if (isEmpty(name)) {
      logError('Failed to create reports on all VMs');
    } else {
      logError(`Failed to create a report on VM '${name}'`);
    }
    logError(error);
  }
}
