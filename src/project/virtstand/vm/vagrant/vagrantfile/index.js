import * as ejs from 'ejs';
// import { readFile } from 'fs-extra';
// import { parse } from 'yaml';
// import { join } from 'path';
import { get, merge } from 'lodash';
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

  convertObject(config, stage) {
    let stageConfig = {};
    if (stage) {
      // apply stage to default config
      stageConfig = get(config, ['stage', stage]);
    }

    const vm = merge({}, this.defaults, config.defaults, stageConfig);

    // console.log(this.template(vm))
    return this.template(vm);
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

