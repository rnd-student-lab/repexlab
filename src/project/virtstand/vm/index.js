import { ensureDir, writeFile } from 'fs-extra';
import {
  dirname, join
} from 'path';

import Vagranfile from './vagrant/vagrantfile';
import PluginManager from './vagrant/pluginManager';
import VirtualMachineOperations from './operations';
import VirtualMachineConfig from './config';

export default class VirtualMachine {
  constructor(path, name, virtstandDirectory, stage) {
    this.utilityDirectoryName = 'vm';
    this.vagrantfileName = 'Vagrantfile';
    this.mainFileName = 'vm.yml';

    this.filePath = join(path, this.mainFileName);
    this.workingDirectory = dirname(this.filePath);
    this.name = name;
    this.stage = stage;

    this.virtstandDirectory = virtstandDirectory;
    this.compilationTargetDirectory = join(
      this.virtstandDirectory,
      this.utilityDirectoryName,
      this.name
    );

    this.vagrantfile = new Vagranfile();
    this.operations = new VirtualMachineOperations(this.compilationTargetDirectory);
    this.config = new VirtualMachineConfig();
  }

  async create(config) {
    await this.config.create(config);
    await this.config.save(this.filePath);
  }

  async init() {
    await this.config.init(this.filePath);
  }

  getCompiledConfigObject() {
    return this.vagrantfile.compileConfigObject(this.config.getConfigObject(), this.stage);
  }

  async compile() {
    const vmTargetPath = join(this.compilationTargetDirectory, this.vagrantfileName);
    const output = this.vagrantfile.convertObject(
      this.config.getConfigObject(),
      this.stage,
      this.workingDirectory,
      this.compilationTargetDirectory
    );

    await ensureDir(this.compilationTargetDirectory);
    await writeFile(vmTargetPath, output);

    const pluginManager = new PluginManager(this.compilationTargetDirectory);
    await pluginManager.ensurePlugins();
  }
}
