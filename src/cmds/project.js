export const command = ['project <command>'];
export const desc = 'Run command on experiment project';
export const builder = yargs => yargs.commandDir('projectCmds');
export const handler = argv => {
  console.log(argv);
};
