export const command = ['vm <command>'];
export const desc = 'Run command on Virtual Machine(s)';
export const builder = yargs => yargs.commandDir('vmCmds');
export const handler = argv => {
  console.log(argv);
};
