import { isEmpty } from 'lodash';
import Repexlab from '../../project/repexlab';
import { logError, logSuccess } from '../../utils/logger';
import { handler as compile } from './compile';

export const command = 'restoreSnapshot';
export const desc = 'Restore an existing Virtual Machine state from snapshot';
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

export const handler = async argv => {
  await compile(argv);
  await run(argv);
};

export async function run(argv) {
  const { name, stage, snapshotName } = argv;

  const repexlab = new Repexlab(stage);
  await repexlab.init('./');
  try {
    await repexlab.operations.restoreSnapshot(name, snapshotName);
    if (isEmpty(name)) {
      logSuccess('Restored each VM state from snapshot');
    } else {
      logSuccess(`Restored VM '${name}' from snapshot`);
    }
  } catch (error) {
    if (isEmpty(name)) {
      logError('Failed to restore each VM state from snapshot');
    } else {
      logError(`Failed to restore VM '${name}' from snapshot`);
    }
    logError(error);
  }
}
