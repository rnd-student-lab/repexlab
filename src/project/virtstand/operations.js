import {
  castArray, compact, filter, first, includes, isEmpty, map,
} from 'lodash';
import { join } from 'path';

export default class VirtstandOperations {
  constructor(workingDirectory, virtualMachines) {
    this.workingDirectory = workingDirectory;
    this.virtualMachines = virtualMachines;
  }

  // setVirtualMachines(virtualMachines) {
  //   this.virtualMachines = virtualMachines;
  // }

  getVMsByNames(names) {
    const vmNames = compact(castArray(names));
    const vms = filter(
      this.virtualMachines,
      (vm) => isEmpty(names) || (includes(vmNames, vm.name))
    );
    return vms;
  }

  async compile(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.compile()
    ));
  }

  async start(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.start()
    ));
  }

  async restart(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.restart()
    ));
  }

  async setupHosts(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.setupHosts(
        this.virtualMachines
      )
    ));
  }

  async provision(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.provision()
    ));
  }

  async stop(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.stop()
    ));
  }

  async destroy(names) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.destroy()
    ));
  }

  async status(names) {
    return Promise.all(map(this.getVMsByNames(names), async (virtualMachine) => {
      const status = await virtualMachine.operations.status();
      return `${virtualMachine.name}: ${status}`;
    }));
  }

  async ssh(names) {
    const virtualMachine = first(this.getVMsByNames(names));
    await virtualMachine.operations.ssh();
  }

  async exec(names, command) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.exec(command)
    ));
  }

  async report(names, timestamp, start, end, labels) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => {
        const destination = join(this.workingDirectory, `reports/${timestamp}/${virtualMachine.name}`);
        return virtualMachine.operations.report(destination, start, end, labels);
      }
    ));
  }

  async copy(names, direction, from, to) {
    await Promise.all(map(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.copy(
        this.workingDirectory,
        direction,
        from,
        to
      )
    ));
  }
}
