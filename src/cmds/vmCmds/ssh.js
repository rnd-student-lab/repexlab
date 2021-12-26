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
  await run(argv.name);
};

async function run(name) {
  const virtstand = new Virtstand();
  await virtstand.init('./');
  await virtstand.ssh(name);
}
