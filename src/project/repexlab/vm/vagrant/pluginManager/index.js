import { join } from 'node:path';
import { platform } from 'node:process';
import execa from 'execa';
import {
  map,
  reduce, some, split, startsWith
} from 'lodash';
import { readJSON } from 'fs-extra';

export default class PluginManager {
  constructor(vmTargetDirectory) {
    this.requiredPlugins = [
      'vagrant-bindfs',
      'vagrant-disksize',
      'vagrant-scp',
    ];
    if (platform === 'win32') {
      this.requiredPlugins.push('vagrant-winnfsd');
    }
    this.installedPlugins = [];
    this.vmTargetDirectory = vmTargetDirectory;

    this.vagrantDirectory = '.vagrant';
    this.pluginListFile = 'plugins.json';
  }

  async installPlugin(plugin) {
    await execa(`vagrant plugin install --local ${plugin}`, {
      cwd: this.vmTargetDirectory,
    });
    await this.refreshInstalledPlugins();
  }

  async isPluginInstalled(plugin) {
    return some(this.installedPlugins, (line) => startsWith(line, plugin));
  }

  async refreshInstalledPlugins() {
    try {
      const plugins = await readJSON(
        join(this.vmTargetDirectory, this.vagrantDirectory, this.pluginListFile)
      );
      this.installedPlugins = map(plugins.installed, (data, plugin) => `${plugin} (${data.installed_gem_version}, local)`);
    } catch (e) {
      const { stdout } = await execa('vagrant plugin list --local', {
        cwd: this.vmTargetDirectory,
      });
      this.installedPlugins = split(stdout, '\n');
    }

    return this.installedPlugins;
  }

  async ensurePlugins() {
    await this.refreshInstalledPlugins();

    await reduce(this.requiredPlugins, async (acc, plugin) => {
      await acc;
      const alreadyInstalled = await this.isPluginInstalled(plugin);
      if (!alreadyInstalled) {
        await this.installPlugin(plugin);
      }
    }, Promise.resolve());

    await this.refreshInstalledPlugins();
  }
}
