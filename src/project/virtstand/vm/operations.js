import { readFile } from 'fs-extra';
import {
  posix, relative, resolve, sep
} from 'path';
import * as vagrant from 'node-vagrant';
import {
  first, get, includes, reduce, split
} from 'lodash';
import { spawn } from 'child_process';
import SSH2Promise from 'ssh2-promise';
import execa from 'execa';

vagrant.promisify();

export default class VirtualMachineOperations {
  constructor(compilationTargetDirectory) {
    this.compilationTargetDirectory = compilationTargetDirectory;
  }

  async start() {
    const command = 'vagrant up --no-provision';
    await execa.command(command, {
      cwd: this.compilationTargetDirectory,
    });
  }

  async restart() {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
    await machine.reload();
  }

  async setupHosts(vms) {
    await reduce(vms, async (acc, vm) => {
      await acc;
      const { ip } = vm.getCompiledConfigObject().provider.network;
      const { hostname } = vm.getCompiledConfigObject().provider;
      const entry = `'${ip} ${hostname}'`;
      const command = `sudo bash -c "grep -qxF ${entry} /etc/hosts || echo ${entry} >> /etc/hosts"`;
      await this.exec(command);
    }, Promise.resolve());
  }

  async provision() {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
    await machine.provision();
  }

  async stop() {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
    await machine.halt();
  }

  async destroy() {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
    await machine.destroy();
  }

  async status() {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
    const status = await machine.status();
    return get(status, 'default.status');
  }

  async ssh() {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
    const sshConfigs = await machine.sshConfig();
    const sshConfig = first(sshConfigs);

    spawn(
      'ssh',
      [
        sshConfig.hostname, '-l', sshConfig.user, '-p', sshConfig.port, '-i', sshConfig.private_key,
        '-o', 'UserKnownHostsFile=/dev/null', '-o', 'StrictHostKeyChecking=no', '-q'
      ],
      { stdio: [process.stdin, process.stdout, process.stderr] }
    );
  }

  async exec(command) {
    const machine = vagrant.create({ cwd: this.compilationTargetDirectory });
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

  async copy(projectPath, direction, from, to) {
    const getRelativePath = (originalPath) => {
      const resolvedPath = resolve(projectPath, originalPath);
      const relativePath = relative(this.compilationTargetDirectory, resolvedPath);
      const posixRelativePath = split(relativePath, sep).join(posix.sep);
      return posixRelativePath;
    };

    const pathFrom = direction === 'in' ? getRelativePath(from) : from;
    const pathTo = direction === 'out' ? getRelativePath(to) : to;

    const vmIn = direction === 'in' ? ':' : '';
    const vmOut = direction === 'out' ? ':' : '';

    const command = `vagrant scp ${vmOut}${pathFrom} ${vmIn}${pathTo}`;

    const out = await execa.command(command, {
      cwd: this.compilationTargetDirectory
    });
    if (includes(out.stderr, 'No such file or directory')) {
      throw out.stderr.toString();
    }
  }
}
