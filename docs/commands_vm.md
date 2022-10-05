# Virtual Machine commands

## Additional documentation

This document is the Repexlab Virtual Machine commands reference. There are more documentation files in
[`docs` in the Repexlab source tree](./):

- [Virtual Machine commands](./commands_vm.md)
- [Project commands](./commands_project.md)
- [Examples](./examples.md)
- [Known issues](./known_issues.md)

## Commands

### repexlab vm compile

Compile virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm compile -n vm1
```

Task automation usage example:

```yaml
- command: compile
  vms:
    - vm1
    - vm2
  description: Run compile command for both VMs
```

### repexlab vm start

Start virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm start -n vm1
```

Task automation usage example:

```yaml
- command: start
  vms: vm1
  description: Start virtual machine "vm1"
```

### repexlab vm stop

Stop virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm stop -n vm1
```

Task automation usage example:

```yaml
- command: stop
  vms: vm1
  description: Stop virtual machine "vm1"
```

### repexlab vm restart

Restart virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm restart -n vm1
```

Task automation usage example:

```yaml
- command: restart
  vms: vm1
  description: Restart virtual machine "vm1"
```

### repexlab vm provision

Provision virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm provision -n vm1
```

Task automation usage example:

```yaml
- command: provision
  vms: vm1
  description: Provision virtual machine "vm1"
```

### repexlab vm setupHosts

Add IP-Hostname bindings to /etc/hosts to virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm setupHosts
```

Task automation usage example:

```yaml
- command: setupHosts
  description: Add IP-Hostname bindings to all virtual machines
```

### repexlab vm destroy

Destroy virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm destroy -n vm1
```

Task automation usage example:

```yaml
- command: destroy
  vms: vm1
  description: Destroy virtual machine "vm1"
```

### repexlab vm copy

Copy a file or a directory between host system and virtual machine(s). Host path must be relative to the project root directory.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|Yes|-|
|--stage|-s|Experiment stage name|string|No|-|
|--direction|-d|Copy direction (available options: in, out)|string|No|-|
|--from|-f|Target to copy from|string|Yes|-|
|--to|-t|Target to copy to|string|Yes|-|

CLI usage example:

```bash
repexlab vm copy -n vm1 -d out -f "/home/vagrant/atop.raw.txt" -t "./data/atop.raw.txt"
```

Task automation usage example:

```yaml
- command: copy
  vms: vm1
  options:
    direction: out
    from: /home/vagrant/atop.raw.txt
    to: ./data/atop.raw.txt
  description: Copy atop.txt file from VM to host
```

### repexlab vm exec

Execute a shell command on virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|
|--stage|-s|Experiment stage name|string|No|-|
|--command|-c|Shell command|string|Yes|-|

CLI usage example:

```bash
repexlab vm exec -c "atop -r ${atop_log} -P CPU,MEM > /home/vagrant/atop.raw.txt"
```

Task automation usage example:

```yaml
- command: exec
  options:
    command: atop -r ${atop_log} -P CPU,MEM > /home/vagrant/atop.raw.txt
  description: Export atop logs to the atop.raw.txt
```

### repexlab vm report

Create a resource usage report for virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|
|--stage|-s|Experiment stage name|string|No|-|
|--start||Timespan start time (or start stage name for task automation)|string|Yes|-|
|--end||Timespan end time (or end stage name for task automation)|string|No|Now|
|--labels|-l|List of Atop labels to report (eg. CPU, MEM, DSK)|array|Yes|-|

CLI usage example:

```bash
repexlab vm report -n vm1 --start 13:30:58 --end 13:50:00 -l CPU,MEM
```

Task automation usage example:

```yaml
- command: report
  options:
    start: beginning
    end: main
    labels:
      - CPU
      - MEM
  description: Export CPU and MEM reports
```

### repexlab vm ssh

Connect to a single specified virtual machine using SSH.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|

CLI usage example:

```bash
repexlab vm ssh -n vm1
```

### repexlab vm status

Display status of virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm status
```

### repexlab vm saveSnapshot

Create a snapshot of specified virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|Yes|-|
|--stage|-s|Experiment stage name|string|No|-|
|--snapshotName|--sn|Snapshot name|string|Yes|-|

CLI usage example:

```bash
repexlab vm saveSnapshot -n vm1 --sn mySnapshotName
```

Task automation usage example:

```yaml
- command: saveSnapshot
  vms: vm1
  options:
    snapshotName: mySnapshotName
  description: Create a snapshot of 'vm1' named 'mySnapshotName'
```

### repexlab vm restoreSnapshot

Restore state of specified virtual machine(s) from specified snapshot.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|Yes|-|
|--stage|-s|Experiment stage name|string|No|-|
|--snapshotName|--sn|Snapshot name|string|Yes|-|

CLI usage example:

```bash
repexlab vm restoreSnapshot -n vm1 --sn mySnapshotName
```

Task automation usage example:

```yaml
- command: restoreSnapshot
  vms: vm1
  options:
    snapshotName: mySnapshotName
  description: Restore state of 'vm1' from snapshot named 'mySnapshotName'
```

### repexlab vm removeSnapshot

Remove a snapshot of specified virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|Yes|-|
|--stage|-s|Experiment stage name|string|No|-|
|--snapshotName|--sn|Snapshot name|string|Yes|-|

CLI usage example:

```bash
repexlab vm removeSnapshot -n vm1 --sn mySnapshotName
```

Task automation usage example:

```yaml
- command: removeSnapshot
  vms: vm1
  options:
    snapshotName: mySnapshotName
  description: Remove a snapshot of 'vm1' named 'mySnapshotName'
```

### repexlab vm listSnapshots

Display existing snapshots of virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab vm listSnapshots
```
