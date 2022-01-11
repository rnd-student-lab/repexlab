export const command = ['stage <command>'];
export const desc = 'Run scaffolding command regarding experiment stages';
export const builder = yargs => yargs.commandDir('stageCmds');
export const handler = argv => {
  console.log(argv);
};
