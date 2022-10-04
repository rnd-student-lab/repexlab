import { isEmpty } from 'lodash';
import Repexlab from '../../project/repexlab';
import { logError, logSuccess } from '../../utils/logger';

export const command = 'saveSnapshot';
export const desc = 'Save an existing Virtual Machine state to a snapshot';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: true,
  })
  .option('snapshotName', {
    alias: 'sn',
    string: true,
    describe: 'Snapshot name',
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

export const handler = argv => {
  run(argv);
};

export async function run(argv) {
  const { name, stage, snapshotName } = argv;

  const repexlab = new Repexlab(stage);
  await repexlab.init('./');
  try {
    await repexlab.operations.saveSnapshot(name, snapshotName);
    if (isEmpty(name)) {
      logSuccess('Saved snapshot for each of VMs');
    } else {
      logSuccess(`Saved snapshot of VM '${name}'`);
    }
  } catch (error) {
    if (isEmpty(name)) {
      logError('Failed to save snapshot for each of VMs');
    } else {
      logError(`Failed to save snapshot of VM '${name}'`);
    }
    logError(error);
  }
}
