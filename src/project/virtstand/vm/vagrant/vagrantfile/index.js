import * as ejs from 'ejs';
// import { readFile } from 'fs-extra';
// import { parse } from 'yaml';
import { relative, resolve, posix, sep } from 'path';
import { cloneDeep, each, get, join, merge, replace, set, split } from 'lodash';
import template from './vagrantfile';


export class Vagranfile {

  constructor() {
    this.template = ejs.compile(template, {});

    this.defaults = {
      'provider': {
        provider: 'virtualbox',
        memory: 2048,
        cpus: 2,
        gui: false,
        hostname: 'localhost',
        customize: [],
      },
      synced_folder: {
        type: 'nfs',
        from: '../../data',
        to: '/vagrant',
        mount_options: {
          actimeo: 1
        },
      },
    }
  }

  convertObject(config, stage, configDir, targetDir) {
    let stageConfig = {};
    if (stage) {
      stageConfig = get(config, ['stage', stage]);
    }

    const vm = merge({}, this.defaults, config.defaults, stageConfig);
    const vmWithUpdatedPaths = this.replacePaths(vm, configDir, targetDir);
    return this.template(vmWithUpdatedPaths);
  }

  replacePaths(config, configDir, targetDir) {
    const properties = [
      'synced_folder.from',
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

  // async convertFile(path, stage) {
  //   const config = await this.readFile(path);
  //   return this.convertObject(config);
  // }

  // async readFile(path) {
  //   const file = (await readFile(join('./', path))).toString();
  //   return parse(file);
  // }
}

