import { pathExists } from 'fs-extra';
import {
  castArray, compact, filter, first, includes, isEmpty, map, range, reduce, split, take
} from 'lodash';
import {
  resolve, sep, join, dirname
} from 'path';
import ConfigFile from '../configFile';
import VirtualMachine from './vm';

export default class Virtstand {
  constructor() {
    this.mainFileName = 'virtstand.yml';
    this.virtstandDirectoryName = '.virtstand';
    this.config = null;
    this.filePath = null;
    this.workingDirectory = null;
    this.virtstandDirectory = null;
    this.stage = null;

    this.virtualMachines = [];
  }

  async init(dir, stage) {
    this.filePath = await this.searchMainFile(dir);
    this.config = await ConfigFile.read(this.filePath);
    this.workingDirectory = dirname(this.filePath);
    this.virtstandDirectory = join(this.workingDirectory, this.virtstandDirectoryName);
    this.stage = stage;

    await this.initVirtualMachines();
  }

  async initVirtualMachines() {
    this.virtualMachines = await Promise.all(map(this.config.vms, async (declaration) => {
      const virtualMachine = new VirtualMachine();
      await virtualMachine.init(
        join(this.workingDirectory, declaration.path),
        this.stage,
        declaration.name,
        this.virtstandDirectory
      );
      return virtualMachine;
    }));
  }

  async searchMainFile(dir) {
    const dirs = split(resolve(dir), sep);
    const paths = map(
      range(dirs.length, 0, -1),
      (len) => resolve(sep, join(...take(dirs, len), this.mainFileName))
    );

    const path = await reduce(paths, async (acc, item) => {
      await acc;
      if (isEmpty(acc) && await pathExists(item)) {
        return item;
      }
      return acc;
    }, Promise.resolve(null));

    if (isEmpty(path)) {
      throw new Error('File `virtstand.yml` not found!');
    }

    return path;
  }

  getVMsByNames(names) {
    const vmNames = compact(castArray(names));
    const vms = filter(
      this.virtualMachines,
      (vm) => isEmpty(names) || (includes(vmNames, vm.name))
    );
    return vms;
  }

  async compile(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.compile()
    ));
  }

  async start(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.start()
    ));
  }

  async restart(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.restart()
    ));
  }

  async setupHosts(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.setupHosts(
        this.virtualMachines
      )
    ));
  }

  async provision(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.provision()
    ));
  }

  async stop(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.stop()
    ));
  }

  async destroy(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.destroy()
    ));
  }

  async status(names) {
    return Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      const status = await virtualMachine.status();
      return `${virtualMachine.name}: ${status}`;
    }));
  }

  async ssh(names) {
    const virtualMachine = first(this.getVMsByNames(names));
    await virtualMachine.ssh();
  }

  async exec(names, command) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.exec(command)
    ));
  }

  async copy(names, direction, from, to) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.copy(
        this.workingDirectory,
        direction,
        from,
        to
      )
    ));
  }
}
