import {
  cloneDeep, filter, find, merge, some
} from 'lodash';
import ConfigFile from '../configFile';

export default class VirtstandConfig {
  constructor() {
    this.defaults = {
      version: '0.1',
      vms: [
      ],
      stages: [
      ]
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
    return cloneDeep(this.config);
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
    return cloneDeep(this.config.stages);
  }
}
