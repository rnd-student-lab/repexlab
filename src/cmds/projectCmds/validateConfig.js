import { each, find } from 'lodash';
import { logError, logWarning } from '../../utils/logger';
import Repexlab from '../../project/repexlab';

export const command = 'validateConfig';
export const desc = 'Validate the repex.yml configuration file';
export const builder = yargs => yargs;

export const handler = async argv => {
  await run(argv);
};

async function run() {
  const commonRepexlab = new Repexlab();
  await commonRepexlab.init('./');
  const issues = await commonRepexlab.validateConfig();

  each(issues, (issue) => {
    switch (issue.type) {
      case 'WARNING':
        logWarning(`${issue.type} ${issue.code}: ${issue.message}`);
        break;
      case 'ERROR':
        logError(`${issue.type} ${issue.code}: ${issue.message}`);
        break;
      default:
        break;
    }
  });

  const hasErrors = find(issues, (issue) => (issue.type === 'ERROR'));
  if (hasErrors) {
    throw new Error('Please, fix the errors above before proceeding');
  }
}
