import { ensureDir, writeFile } from 'fs-extra';
import { dirname, join } from 'path';
import * as vagrant from 'node-vagrant';
import { get } from 'lodash';
import execa from 'execa';
import ConfigFile from '../../configFile';
import Vagranfile from './vagrant/vagrantfile';
import PluginManager from './vagrant/pluginManager';

vagrant.promisify();

export default class VirtualMachine {
  constructor() {
    this.utilityDirectoryName = 'vm';
    this.vagrantfileName = 'Vagrantfile';
    this.mainFileName = 'vm.yml';
    this.config = null;
    this.filePath = null;
    this.workingDirectory = null;
    this.name = null;
    this.stage = null;
    this.vagrantfile = new Vagranfile();
  }

  async init(path, stage, name) {
    this.filePath = join(path, this.mainFileName);
    this.config = await ConfigFile.read(this.filePath);
    this.workingDirectory = dirname(this.filePath);
    this.name = name;
    this.stage = stage;
  }

  getVMTargetDirectory(targetDirectory) {
    return join(targetDirectory, this.utilityDirectoryName, this.name);
  }

  async compile(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const vmTargetPath = join(vmTargetDirectory, this.vagrantfileName);
    const output = this.vagrantfile.convertObject(
      this.config,
      this.stage,
      this.workingDirectory,
      vmTargetDirectory
    );

    await ensureDir(vmTargetDirectory);
    await writeFile(vmTargetPath, output);

    const pluginManager = new PluginManager(vmTargetDirectory);
    await pluginManager.ensurePlugins();
  }

  async start(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    await machine.up('--no-provision');
  }

  async restart(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    await machine.reload();
  }

  async provision(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    await machine.provision();
  }

  async stop(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    await machine.halt();
  }

  async destroy(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    await machine.destroy();
  }

  async status(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    const status = await machine.status();
    return get(status, 'default.status');
  }
}
