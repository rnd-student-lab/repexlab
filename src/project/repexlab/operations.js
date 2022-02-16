import {
  castArray, compact, filter, first, includes, isEmpty, map, reduce
} from 'lodash';
import { join } from 'path';

export default class RepexlabOperations {
  constructor(workingDirectory, virtualMachines) {
    this.workingDirectory = workingDirectory;
    this.virtualMachines = virtualMachines;
  }

  // setVirtualMachines(virtualMachines) {
  //   this.virtualMachines = virtualMachines;
  // }

  async runParallel(virtualMachines, action) {
    return Promise.all(map(virtualMachines, async (virtualMachine) => action(virtualMachine)));
  }

  async runSequential(virtualMachines, action) {
    return reduce(virtualMachines, async (acc, virtualMachine) => {
      const results = await acc;
      const result = await action(virtualMachine);
      return [...results, result];
    }, Promise.resolve([]));
  }

  getVMsByNames(names) {
    const vmNames = compact(castArray(names));
    const vms = filter(
      this.virtualMachines,
      (vm) => isEmpty(names) || (includes(vmNames, vm.name))
    );
    return vms;
  }

  async compile(names) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.compile()
    );
  }

  async start(names) {
    await this.runSequential(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.start()
    );
  }

  async restart(names) {
    await this.runSequential(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.restart()
    );
  }

  async setupHosts(names) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.setupHosts(
        this.virtualMachines
      )
    );
  }

  async provision(names) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.provision()
    );
  }

  async stop(names) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.stop()
    );
  }

  async destroy(names) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.destroy()
    );
  }

  async status(names) {
    return this.runParallel(this.getVMsByNames(names), async (virtualMachine) => {
      const status = await virtualMachine.operations.status();
      return `${virtualMachine.name}: ${status}`;
    });
  }

  async ssh(names) {
    const virtualMachine = first(this.getVMsByNames(names));
    await virtualMachine.operations.ssh();
  }

  async exec(names, command) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.exec(command)
    );
  }

  async report(names, timestamp, start, end, labels) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => {
        const destination = join(this.workingDirectory, `reports/${timestamp}/${virtualMachine.name}`);
        return virtualMachine.operations.report(destination, start, end, labels);
      }
    );
  }

  async copy(names, direction, from, to) {
    await this.runParallel(
      this.getVMsByNames(names),
      async (virtualMachine) => virtualMachine.operations.copy(
        this.workingDirectory,
        direction,
        from,
        to
      )
    );
  }
}
