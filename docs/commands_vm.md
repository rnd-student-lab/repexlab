# Virtual Machine commands

## Additional documentation

This document is the Virtstand Virtual Machine commands reference. There are more documentation files in
[`docs` in the Virtstand source tree](./):

- [Virtual Machine commands](./commands_vm.md)
- [Project commands](./commands_project.md)
- [Examples](./examples.md)
- [Known issues](./known_issues.md)

## Commands

### virtstand vm compile

Compile virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm compile -n vm1
```

Task automation usage example:

```yaml
- command: compile
  vms:
    - vm1
    - vm2
  description: Run compile command for both VMs
```

### virtstand vm start

Start virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm start -n vm1
```

Task automation usage example:

```yaml
- command: start
  vms: vm1
  description: Start virtual machine "vm1"
```

### virtstand vm stop

Stop virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm stop -n vm1
```

Task automation usage example:

```yaml
- command: stop
  vms: vm1
  description: Stop virtual machine "vm1"
```

### virtstand vm restart

Restart virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm restart -n vm1
```

Task automation usage example:

```yaml
- command: restart
  vms: vm1
  description: Restart virtual machine "vm1"
```

### virtstand vm provision

Provision virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm provision -n vm1
```

Task automation usage example:

```yaml
- command: provision
  vms: vm1
  description: Provision virtual machine "vm1"
```

### virtstand vm setupHosts

Add IP-Hostname bindings to /etc/hosts to virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm setupHosts
```

Task automation usage example:

```yaml
- command: setupHosts
  description: Add IP-Hostname bindings to all virtual machines
```

### virtstand vm destroy

Destroy virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm destroy -n vm1
```

Task automation usage example:

```yaml
- command: destroy
  vms: vm1
  description: Destroy virtual machine "vm1"
```

### virtstand vm copy

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
virtstand vm copy -n vm1 -d out -f "/home/vagrant/atop.raw.txt" -t "./data/atop.raw.txt"
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

### virtstand vm exec

Execute a shell command on virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|
|--stage|-s|Experiment stage name|string|No|-|
|--command|-c|Shell command|string|Yes|-|

CLI usage example:

```bash
virtstand vm exec -c "atop -r ${atop_log} -P CPU,MEM > /home/vagrant/atop.raw.txt"
```

Task automation usage example:

```yaml
- command: exec
  options:
    command: atop -r ${atop_log} -P CPU,MEM > /home/vagrant/atop.raw.txt
  description: Export atop logs to the atop.raw.txt
```

### virtstand vm report

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
virtstand vm report -n vm1 --start 13:30:58 --end 13:50:00 -l CPU,MEM
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

### virtstand vm ssh

Connect to a single specified virtual machine using SSH.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|

CLI usage example:

```bash
virtstand vm ssh -n vm1
```

### virtstand vm status

Display status of virtual machine(s).

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|All VMs|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand vm status
```
