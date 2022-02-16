#!/usr/bin/env node
import yargs from 'yargs';

yargs // eslint-disable-line
  .commandDir('cmds')
  .usage('Usage: repexlab <command> [options]')
  .demandCommand(1)
  .help('h')
  .alias('h', 'help').argv;
