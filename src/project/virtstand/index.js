import {
  ensureDir, pathExists, remove, writeFile
} from 'fs-extra';
import {
  isEmpty, map, range, reduce, split, take
} from 'lodash';
import {
  resolve, sep, join, dirname
} from 'path';
import VirtstandConfig from './config';
import VirtstandOperations from './operations';
import VirtualMachine from './vm';

import gitignoreTpl from '../templates/projectTemplates/gitignore';
import commonProvisionTpl from '../templates/projectTemplates/provision/common/provision';
import dataGitkeepTpl from '../templates/projectTemplates/data/gitkeep';

export default class Virtstand {
  constructor(stage) {
    this.mainFileName = 'virtstand.yml';
    this.virtstandDirectoryName = '.virtstand';
    this.filePath = null;
    this.workingDirectory = null;
    this.virtstandDirectory = null;
    this.stage = stage;

    this.virtualMachines = [];
    this.config = new VirtstandConfig();
    this.operations = null;
  }

  async createDefaultProjectFiles() {
    await ensureDir(join(this.workingDirectory, 'provision/common'));
    await ensureDir(join(this.workingDirectory, 'data'));

    await writeFile(join(this.workingDirectory, '.gitignore'), gitignoreTpl);
    await writeFile(join(this.workingDirectory, 'provision/common/provision.yml'), commonProvisionTpl);
    await writeFile(join(this.workingDirectory, 'data/.gitkeep'), dataGitkeepTpl);
  }

  async create(dir) {
    this.filePath = join(dir, this.mainFileName);
    this.workingDirectory = dirname(this.filePath);
    this.virtstandDirectory = join(this.workingDirectory, this.virtstandDirectoryName);

    await this.config.create();
    await this.config.save(this.filePath);
    await this.createDefaultProjectFiles();

    await this.initVirtualMachines();
    this.operations = new VirtstandOperations(this.workingDirectory, this.virtualMachines);
  }

  async init(dir) {
    this.filePath = await this.searchMainFile(dir);
    this.workingDirectory = dirname(this.filePath);
    this.virtstandDirectory = join(this.workingDirectory, this.virtstandDirectoryName);

    await this.config.init(this.filePath);
    await this.initVirtualMachines();
    this.operations = new VirtstandOperations(this.workingDirectory, this.virtualMachines);
  }

  async initVirtualMachines() {
    this.virtualMachines = await Promise.all(map(this.config.getVMs(), async (declaration) => {
      const virtualMachine = new VirtualMachine(
        join(this.workingDirectory, declaration.path),
        declaration.name,
        this.virtstandDirectory,
        this.stage
      );
      await virtualMachine.init();
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

  async addVM(name, path, config) {
    const virtualMachine = new VirtualMachine(
      join(this.workingDirectory, path),
      name,
      this.virtstandDirectory,
      this.stage
    );
    await virtualMachine.create(config);

    this.config.addVM(name, path);
    this.virtualMachines.push(virtualMachine);
    await this.config.save(this.filePath);
  }

  async removeVM(name) {
    const vm = this.config.getVM(name);
    this.config.removeVM(name);
    await remove(vm.path);
    await this.config.save(this.filePath);
    await this.initVirtualMachines();
  }
}
