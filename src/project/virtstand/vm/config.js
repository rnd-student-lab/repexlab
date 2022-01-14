import { has, merge, set } from 'lodash';
import ConfigFile from '../../configFile';

export default class VirtualMachineConfig {
  constructor() {
    this.defaults = {
      version: '0.1',
      defaults: {
        box: 'ubuntu/bionic64',
        box_version: '>= 0',
        provider: {
          provider: 'virtualbox',
          memory: 2048,
          cpus: 2,
          gui: false,
          hostname: 'virtual_machine',
          network: {
            type: 'private_network',
            ip: '192.168.123.123'
          },
          synced_folder: {
            type: 'virtualbox',
            from: '../../data',
            to: '/vagrant',
            mount_options: {
              dmode: 777,
              fmode: 777,
            },
          },
          customize: [
            [
              'modifyvm',
              ':id',
              '--cpuexecutioncap',
              100
            ],
            [
              'setextradata',
              ':id',
              'VBoxInternal2/SharedFoldersEnableSymlinksCreate/vagrant',
              '1'
            ]
          ]
        },
        provision: [
          {
            type: 'ansible',
            directory: '../../provision/common',
            file: 'provision.yml'
          },
          {
            type: 'ansible',
            directory: 'provision',
            file: 'provision.yml'
          }
        ]
      },
      stage: {

      }
    };

    this.config = null;
  }

  create(config) {
    this.config = merge({}, this.defaults, config);
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

  addProvision(type, directory, file, stage) {
    if (!stage) {
      this.config.defaults.provision.push({
        type,
        directory,
        file,
      });
      return;
    }
    if (!has(this.config, ['stage', stage, 'provision'])) {
      set(this.config, ['stage', stage, 'provision'], []);
    }
    this.config.stage[stage].provision.push({
      type,
      directory,
      file,
    });
  }
}
