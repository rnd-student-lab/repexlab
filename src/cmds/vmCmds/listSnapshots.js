import { isEmpty } from 'lodash';
import { stringify } from 'yaml';
import Repexlab from '../../project/repexlab';
import { logError, logSuccess, logInfo } from '../../utils/logger';
import { handler as compile } from './compile';

export const command = 'listSnapshots';
export const desc = 'List snapshots of an existing Virtual Machine';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: false,
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
  const { name, stage } = argv;

  const repexlab = new Repexlab(stage);
  await repexlab.init('./');

  if (isEmpty(name)) {
    const snapshots = await repexlab.operations.listSnapshots();
    logSuccess('VMs snapshots:');
    logInfo(stringify(snapshots));
  } else {
    if (!repexlab.config.hasVM(name)) {
      logError(`Virtual Machine '${name}' does not exists`);
      return;
    }
    const snapshots = await repexlab.operations.listSnapshots(name);
    logSuccess(`VM '${name}' snapshots:`);
    logInfo(stringify(snapshots));
  }
}
