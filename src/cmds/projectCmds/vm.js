export const command = ['vm <command>'];
export const desc = 'Run scaffolding command regarding Virtual Machines';
export const builder = yargs => yargs.commandDir('vmCmds');
export const handler = argv => {
  console.log(argv);
};
