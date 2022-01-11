export const command = ['project <command>'];
export const desc = 'Run a command on the experiment project';
export const builder = yargs => yargs.commandDir('projectCmds');
export const handler = argv => {
  console.log(argv);
};
