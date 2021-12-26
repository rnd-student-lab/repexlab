import { ensureDir, readFile, writeFile } from 'fs-extra';
import { dirname, join } from 'path';
import * as vagrant from 'node-vagrant';
import { first, get } from 'lodash';
import { spawn } from 'child_process';
import SSH2Promise from 'ssh2-promise';
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

  async ssh(targetDirectory) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    const sshConfigs = await machine.sshConfig();
    const sshConfig = first(sshConfigs);

    spawn(
      'ssh',
      [`${sshConfig.hostname}`, '-l', sshConfig.user, '-p', sshConfig.port, '-i', sshConfig.private_key],
      { stdio: [process.stdin, process.stdout, process.stderr] }
    );
  }

  async exec(targetDirectory, command) {
    const vmTargetDirectory = this.getVMTargetDirectory(targetDirectory);
    const machine = vagrant.create({ cwd: vmTargetDirectory });
    const sshConfigs = await machine.sshConfig();
    const sshConfig = first(sshConfigs);

    const ssh = new SSH2Promise({
      username: sshConfig.user,
      host: sshConfig.hostname,
      port: sshConfig.port,
      privateKey: await readFile(sshConfig.private_key),
    });
    try {
      const result = await ssh.exec(command);
      ssh.close();
      return result;
    } catch (error) {
      ssh.close();
      throw error.toString();
    }
  }
}
