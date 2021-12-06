import { pathExists, readFile } from "fs-extra";
import { castArray, compact, filter, includes, isEmpty, map, range, reduce, split, take, toArray } from "lodash";
import { resolve, sep, join, dirname } from "path";
import { ConfigFile } from "../configFile";
import { VirtualMachine } from "./vm";


export class Virtstand {

  constructor() {
    this.mainFileName = 'virtstand.yml';
    this.utilityDirectoryName = '.virtstand';
    this.config = null;
    this.filePath = null;
    this.workingDirectory = null;
    this.utilityDirectory = null;

    this.virtualMachines = [];
  }

  async init(dir) {
    this.filePath = await this.searchMainFile(dir);
    this.config = await ConfigFile.read(this.filePath);
    this.workingDirectory = dirname(this.filePath);
    this.utilityDirectory = join(this.workingDirectory, this.utilityDirectoryName);

    await this.initVirtualMachines();
  }

  async initVirtualMachines() {
    this.virtualMachines = await Promise.all(map(this.config.vms, async (declaration) => {
      const virtualMachine = new VirtualMachine();
      await virtualMachine.init(join(this.workingDirectory, declaration.path), declaration.name);
      return virtualMachine;
    }));
  }

  async searchMainFile(dir) {
    const dirs = split(resolve(dir), sep);
    const paths = map(range(dirs.length, 0, -1), (len) => resolve(sep, join(...take(dirs, len), this.mainFileName)));

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
    const vms = filter(this.virtualMachines, (vm) => isEmpty(names) || (includes(vmNames, vm.name)));
    return vms;
  }

  async compile(names) {
    await Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      return virtualMachine.compile(this.utilityDirectory);
    }));
  }

  async start(names) {
    await Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      return virtualMachine.start(this.utilityDirectory);
    }));
  }

  async stop(names) {
    await Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      return virtualMachine.stop(this.utilityDirectory);
    }));
  }

  async destroy(names) {
    await Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      return virtualMachine.destroy(this.utilityDirectory);
    }));
  }

  async status(names) {
    return await Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      const status = await virtualMachine.status(this.utilityDirectory);
      return `${virtualMachine.name}: ${status}`;
    }));
  }

}
