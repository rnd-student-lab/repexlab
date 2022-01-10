import * as ejs from 'ejs';
// import { readFile } from 'fs-extra';
// import { parse } from 'yaml';
import {
  relative, resolve, posix, sep
} from 'path';
import {
  cloneDeep, each, get, join, map, merge, range, set, split
} from 'lodash';
import template from './vagrantfile';

export default class Vagranfile {
  constructor() {
    this.template = ejs.compile(template, {});

    this.defaults = {
      provider: {
        provider: 'virtualbox',
        memory: 2048,
        cpus: 2,
        gui: false,
        hostname: 'localhost',
        customize: [],
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
      provision: [],
    };
  }

  compileConfigObject(config, stage) {
    let stageConfig = {};
    if (stage) {
      stageConfig = get(config, ['stage', stage]);
    }
    return merge({}, this.defaults, config.defaults, stageConfig);
  }

  convertObject(config, stage, configDir, targetDir) {
    const vm = this.compileConfigObject(config, stage);
    const vmWithUpdatedPaths = this.constructor.replacePaths(vm, configDir, targetDir);
    return this.template(vmWithUpdatedPaths);
  }

  static replacePaths(config, configDir, targetDir) {
    const numberOfProvisions = get(config, 'provision.length', 0);
    const properties = [
      'synced_folder.from',
      ...map(range(0, numberOfProvisions, 1), (i) => `provision[${i}].directory`),
    ];
    const updatedConfig = cloneDeep(config);

    each(properties, prop => {
      const originalPath = get(config, prop);
      if (originalPath) { // Update only if the property exists
        const resolvedPath = resolve(configDir, get(config, prop));
        const relativePath = relative(targetDir, resolvedPath);
        const posixRelativePath = join(split(relativePath, sep), posix.sep);
        set(updatedConfig, prop, posixRelativePath);
      }
    });

    return updatedConfig;
  }
}
