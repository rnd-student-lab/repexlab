import execa from 'execa';
import {
  reduce, some, split, startsWith
} from 'lodash';

export default class PluginManager {
  constructor(vmTargetDirectory) {
    this.requiredPlugins = [
      'vagrant-bindfs',
      'vagrant-disksize',
      'vagrant-winnfsd',
      'vagrant-scp',
    ];
    this.installedPlugins = [];
    this.vmTargetDirectory = vmTargetDirectory;
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
    const { stdout } = await execa('vagrant plugin list --local', {
      cwd: this.vmTargetDirectory,
    });

    this.installedPlugins = split(stdout, '\n');
    return this.installedPlugins;
  }

  async ensurePlugins() {
    await this.refreshInstalledPlugins();

    console.log(this.installedPlugins);
    await reduce(this.requiredPlugins, async (acc, plugin) => {
      await acc;
      const alreadyInstalled = await this.isPluginInstalled(plugin);
      if (!alreadyInstalled) {
        await this.installPlugin(plugin);
      }
    }, Promise.resolve());
    await this.refreshInstalledPlugins();
    console.log(this.installedPlugins);
  }
}
