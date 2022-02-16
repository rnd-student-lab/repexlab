import Repexlab from '../../project/repexlab';

export const command = 'ssh';
export const desc = 'Connect to a single specified VM using SSH';
export const builder = yargs => yargs
  .option('name', {
    alias: 'n',
    string: true,
    describe: 'VM name',
    requiresArg: true,
    required: true,
  });

export const handler = async argv => {
  await run(argv);
};

export async function run(argv) {
  const { name, stage } = argv;
  const repexlab = new Repexlab(stage);
  await repexlab.init('./');
  await repexlab.operations.ssh(name);
}
