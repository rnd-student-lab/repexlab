export const command = ['provision <command>'];
export const desc = 'Run scaffolding command regarding Virtual Machine provision';
export const builder = yargs => yargs.commandDir('provisionCmds');
export const handler = argv => {
  console.log(argv);
};
