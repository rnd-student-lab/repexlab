import {
  castArray,
  cloneDeep, compact, filter, includes, isEmpty, merge, reduce
} from 'lodash';
import { logInfo } from '../../utils/logger';
import Virtstand from '../../project/virtstand';

import { run as compile } from '../vmCmds/compile';
import { run as copy } from '../vmCmds/copy';
import { run as destroy } from '../vmCmds/destroy';
import { run as exec } from '../vmCmds/exec';
import { run as provision } from '../vmCmds/provision';
import { run as restart } from '../vmCmds/restart';
import { run as start } from '../vmCmds/start';
import { run as stop } from '../vmCmds/stop';

export const command = 'run';
export const desc = 'Run the entire experiment';
export const builder = yargs => yargs
  .option('stage', {
    alias: 's',
    string: true,
    describe: 'Stage name',
    requiresArg: true,
    required: false,
  });

export const handler = async argv => {
  await run(argv);
};

async function run(argv) {
  const { stage } = argv;
  const commonVirtstand = new Virtstand();
  await commonVirtstand.init('./');
  const allStages = cloneDeep(commonVirtstand.config.stages);

  const stageNames = compact(castArray(stage));
  const stages = filter(
    allStages,
    (specificStage) => isEmpty(stageNames) || (includes(stageNames, specificStage.name))
  );

  const availableActions = {
    compile,
    copy,
    destroy,
    exec,
    provision,
    restart,
    start,
    stop,
  };

  await reduce(stages, async (stageAcc, stageItem) => {
    await stageAcc;
    logInfo(`Starting stage "${stageItem.name}"`);
    await availableActions.compile({ stage: stageItem.name }); // Compile all VMs every stage
    await reduce(stageItem.actions, async (actionsAcc, action) => {
      await actionsAcc;
      if (availableActions[action.command]) {
        await availableActions[action.command](merge({ name: action.vms }, action.options));
      }
    }, Promise.resolve());
    logInfo(`Finishing stage "${stageItem.name}"`);
  }, Promise.resolve());
}
