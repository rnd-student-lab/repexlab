import { logSuccess } from '../utils/logger';

// import { Vagranfile } from '../vagrant/vagrantfile'
import Virtstand from '../project/virtstand';

export const command = 'testScript';
export const desc = 'Destroy earth, as if you are not';
export const builder = yargs => yargs.option('why', {
  alias: 'n',
  string: true,
  describe: 'Why do you wanna destroy it?',
  requiresArg: true,
  default: 'I am evil'
});

export const handler = argv => {
  run(argv.why);
};

async function run(why) {
  // const vf = new Vagranfile();
  // vf.convertFile('../virtstand_experiment_1/vms/machine_1/vm.yml')

  const virtstand = new Virtstand();
  await virtstand.init('./');
  console.log(virtstand);

  await virtstand.compile();
  logSuccess(`Destroyed. Reason: ${why}`);
}
