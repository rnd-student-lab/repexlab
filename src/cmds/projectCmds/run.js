import {
  castArray,
  cloneDeep, compact, dropRightWhile, dropWhile, filter, includes, isEmpty, merge, reduce
} from 'lodash';
import { logInfo } from '../../utils/logger';
import Repexlab from '../../project/repexlab';
import { handler as validateConfig } from './validateConfig';

import { run as compile } from '../vmCmds/compile';
import { run as copy } from '../vmCmds/copy';
import { run as destroy } from '../vmCmds/destroy';
import { run as exec } from '../vmCmds/exec';
import { run as setupHosts } from '../vmCmds/setupHosts';
import { run as provision } from '../vmCmds/provision';
import { run as restart } from '../vmCmds/restart';
import { run as start } from '../vmCmds/start';
import { run as stop } from '../vmCmds/stop';
import { run as report } from '../vmCmds/report';
import { run as saveSnapshot } from '../vmCmds/saveSnapshot';
import { run as restoreSnapshot } from '../vmCmds/restoreSnapshot';
import { run as removeSnapshot } from '../vmCmds/removeSnapshot';
import RepexlabStageTimer from '../../project/repexlab/stageTimer';

export const command = 'run';
export const desc = 'Run the entire experiment';
export const builder = yargs => yargs
  .option('stage', {
    alias: 's',
    string: true,
    describe: 'Stage name for running a specific stage',
    requiresArg: true,
    required: false,
  })
  .option('fromStage', {
    alias: 'fs',
    string: true,
    describe: 'Stage name for running all stages starting from this one',
    requiresArg: true,
    required: false,
  })
  .option('toStage', {
    alias: 'ts',
    string: true,
    describe: 'Stage name for running all stages finishing at this one',
    requiresArg: true,
    required: false,
  })
  .conflicts('stage', ['fromStage', 'toStage']);

export const handler = async argv => {
  await validateConfig(argv);
  await run(argv);
};

async function run(argv) {
  const { stage, fromStage, toStage } = argv;
  const commonRepexlab = new Repexlab();
  await commonRepexlab.init('./');
  const allStages = cloneDeep(commonRepexlab.config.getStages());

  let stages = [];
  if (isEmpty(stage)) {
    stages = allStages;
    if (!isEmpty(fromStage)) {
      stages = dropWhile(stages, (specificStage) => (specificStage.name !== fromStage));
    }
    if (!isEmpty(toStage)) {
      stages = dropRightWhile(stages, (specificStage) => (specificStage.name !== toStage));
    }
  } else {
    const stageNames = compact(castArray(stage));
    stages = filter(
      allStages,
      (specificStage) => isEmpty(stageNames) || (includes(stageNames, specificStage.name))
    );
  }

  const availableActions = {
    compile,
    copy,
    destroy,
    exec,
    setupHosts,
    provision,
    restart,
    start,
    stop,
    report,
    saveSnapshot,
    restoreSnapshot,
    removeSnapshot,
  };

  const stageTimer = new RepexlabStageTimer();

  await reduce(stages, async (stageAcc, stageItem) => {
    await stageAcc;
    logInfo(`Starting stage "${stageItem.name}"`);
    stageTimer.set(stageItem.name, 'start');
    await availableActions.compile({ stage: stageItem.name }); // Compile all VMs every stage
    await reduce(stageItem.actions, async (actionsAcc, action) => {
      await actionsAcc;
      if (availableActions[action.command]) {
        await availableActions[action.command](
          merge({ name: action.vms, stage: stageItem.name }, action.options),
          stageTimer
        );
      }
    }, Promise.resolve());
    stageTimer.set(stageItem.name, 'end');
    logInfo(`Finishing stage "${stageItem.name}"`);
  }, Promise.resolve());
}
