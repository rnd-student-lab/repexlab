import {
  filter, find, merge, size, some, uniqBy
} from 'lodash';
import ConfigFile from '../configFile';

export default class RepexlabConfig {
  constructor() {
    this.defaults = {
      version: '0.1',
      vms: [
      ],
      stages: [
        {
          name: 'beginning',
          actions: [
            {
              command: 'start',
              description: 'Starting VMs',
            },
          ],
        },
        {
          name: 'main',
          actions: [
            {
              command: 'provision',
              description: 'Run provisioning scripts on all VMs',
            },
          ],
        },
        {
          name: 'ending',
          actions: [
            {
              command: 'stop',
              description: 'Stopping VMs',
            },
          ],
        },
      ],
    };

    this.config = null;
  }

  create() {
    this.config = merge({}, this.defaults);
  }

  async init(path) {
    this.config = await ConfigFile.read(path);
  }

  async save(path) {
    await ConfigFile.write(path, this.config);
  }

  getConfigObject() {
    return this.config;
  }

  hasVM(name) {
    return some(this.config.vms, (vm) => (vm.name === name));
  }

  getVM(name) {
    return find(this.config.vms, (vm) => (vm.name === name));
  }

  getVMs() {
    return this.config.vms;
  }

  addVM(name, path) {
    this.config.vms.push({
      name,
      path,
    });
  }

  removeVM(name) {
    this.config.vms = filter(this.config.vms, (vm) => (vm.name !== name));
  }

  getStages() {
    return this.config.stages;
  }

  validate() {
    const issues = [];

    if (size(this.getStages()) !== size(uniqBy(this.getStages(), 'name'))) {
      issues.push({
        code: 101,
        message: 'Stage names are not unique',
        type: 'WARNING',
      });
    }

    return issues;
  }
}
