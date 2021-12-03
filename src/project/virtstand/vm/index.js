import { ensureDir, writeFile } from "fs-extra";
import { dirname, join } from "path";
import { ConfigFile } from "../../configFile";
import { Vagranfile } from "./vagrant/vagrantfile";

export class VirtualMachine {

  constructor() {
    this.utilityDirectoryName = 'vm';
    this.vagrantfileName = 'Vagrantfile';
    this.mainFileName = 'vm.yml';
    this.config = null;
    this.filePath = null;
    this.workingDirectory = null;
    this.name = null;
    this.vagrantfile = new Vagranfile();
  }

  async init(path, name) {
    this.filePath = join(path, this.mainFileName);
    this.config = await ConfigFile.read(this.filePath);
    this.workingDirectory = dirname(this.filePath);
    this.name = name;
  }

  async compile(targetDirectory, stage) {
    const vmTargetDirectory = join(targetDirectory, this.utilityDirectoryName, this.name);
    const output = this.vagrantfile.convertObject(this.config, stage);

    await ensureDir(vmTargetDirectory);
    await writeFile(join(vmTargetDirectory, this.vagrantfileName), output);
  }

}
