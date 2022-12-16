import {
  ensureDir, readFile, writeFile, writeJSON
} from 'fs-extra';
import {
  join,
  posix, relative, resolve, sep
} from 'path';
import * as vagrant from 'node-vagrant';
import {
  first, get, includes, reduce, replace, split, trim
} from 'lodash';
import { spawn } from 'child_process';
import SSH2Promise from 'ssh2-promise';
import execa from 'execa';
import moment from 'moment';
import AtopParser from '../../../report/atopParser';
import ReportHTML from '../../../report/html';

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

  async provision(projectPath, vm) {
    const config = vm.getConfigWithRelativePaths(projectPath);

    await this.exec('sudo bash -c "rm -Rf /provision/"');
    await this.exec('sudo bash -c "mkdir -m 777 -p /provision/"');
    await reduce(config.provision, async (acc, provision, i) => {
      await acc;
      await this.copy(projectPath, 'in', provision.directory, `/provision/${i}`);
    }, Promise.resolve());

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

  async report(destination, start, end, labels) {
    const utcOffset = trim(await this.exec('date +"%:z"'));

    const mStart = moment(start, 'HH:mm:ss').utcOffset(utcOffset).format('HH:mm:ss');
    const mEnd = moment(end, 'HH:mm:ss').utcOffset(utcOffset).format('HH:mm:ss');

    await reduce(labels, async (acc, label) => {
      await acc;

      const command = `atop -b ${mStart} -e ${mEnd} -r \${atop_log} -P ${label}`;
      const atopLog = trim(await this.exec(command));

      const atopParser = new AtopParser(atopLog);
      const dsv = atopParser.getDSV();
      const parsed = atopParser.getMonitoringDataByLabel(label);

      const htmlReport = new ReportHTML(
        parsed,
        atopParser.getFieldsByLabel(label),
        moment(start, 'HH:mm:ss'),
        moment(end, 'HH:mm:ss')
      );

      await ensureDir(destination);
      await writeFile(join(destination, `${label}.csv`), dsv);
      await writeJSON(join(destination, `${label}.json`), parsed, { spaces: 2 });
      await writeFile(join(destination, `${label}.html`), htmlReport.buildReport(`Report on "${label}"`));
    }, Promise.resolve());
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

  async saveSnapshot(name) {
    const command = `vagrant snapshot save ${name} --force`;
    await execa.command(command, {
      cwd: this.compilationTargetDirectory,
    });
  }

  async restoreSnapshot(name) {
    const command = `vagrant snapshot restore ${name} --no-provision`;
    await execa.command(command, {
      cwd: this.compilationTargetDirectory,
    });
  }

  async removeSnapshot(name) {
    const command = `vagrant snapshot delete ${name}`;
    await execa.command(command, {
      cwd: this.compilationTargetDirectory,
    });
  }

  async listSnapshots() {
    const command = 'vagrant snapshot list';
    const output = await execa.command(command, {
      cwd: this.compilationTargetDirectory,
    });

    const noSnapshotsText = 'No snapshots have been taken yet!';

    const trimmed = trim(replace(output.stdout, '==> default:', ''));
    if (includes(trimmed, noSnapshotsText)) {
      return noSnapshotsText;
    }

    return split(trimmed, /\r?\n/);
  }
}
