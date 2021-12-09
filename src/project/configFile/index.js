import { ensureDir, readFile, writeFile } from 'fs-extra';
import { dirname } from 'path';
import { parse, stringify } from 'yaml';

export default class ConfigFile {
  static async read(filePath) {
    return parse((await readFile(filePath)).toString());
  }

  static async write(filePath, data) {
    await ensureDir(dirname(filePath));
    return writeFile(filePath, stringify(data));
  }
}
