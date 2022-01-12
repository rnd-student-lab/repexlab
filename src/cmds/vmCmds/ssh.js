import Virtstand from '../../project/virtstand';

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
  const virtstand = new Virtstand(stage);
  await virtstand.init('./');
  await virtstand.operations.ssh(name);
}
