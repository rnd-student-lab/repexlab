# Project commands

## Additional documentation

This document is the Virtstand Project commands reference. There are more documentation files in
[`docs` in the Virtstand source tree](./):

- [Virtual Machine commands](./commands_vm.md)
- [Project commands](./commands_project.md)
- [Examples](./examples.md)

## Commands

### virtstand project init

Initialize a new project.
Current directory must be empty.

CLI usage example:

```bash
virtstand project init
```

### virtstand project run

Run the entire experiment or a specific experiment stage.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
virtstand project run -s main
```

### virtstand project vm add

Add a new virtual machine configuration to the project.

CLI usage example:

```bash
virtstand project vm add
```

### virtstand project vm remove

Remove an existing virtual machine configuration from the project.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|

CLI usage example:

```bash
virtstand project remove -n vm1
```
