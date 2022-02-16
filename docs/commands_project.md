# Project commands

## Additional documentation

This document is the Repexlab Project commands reference. There are more documentation files in
[`docs` in the Repexlab source tree](./):

- [Virtual Machine commands](./commands_vm.md)
- [Project commands](./commands_project.md)
- [Examples](./examples.md)
- [Known issues](./known_issues.md)

## Commands

### repexlab project init

Initialize a new project.
Current directory must be empty.

CLI usage example:

```bash
repexlab project init
```

### repexlab project run

Run the entire experiment or a specific experiment stage.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--stage|-s|Experiment stage name|string|No|-|

CLI usage example:

```bash
repexlab project run -s main
```

### repexlab project vm add

Add a new virtual machine configuration to the project.

CLI usage example:

```bash
repexlab project vm add
```

### repexlab project vm remove

Remove an existing virtual machine configuration from the project.

|Option|Shorthand|Description|Type|Required|Default value|
|-|-|-|-|-|-|
|--name|-n|Virtual machine name|string|No|-|

CLI usage example:

```bash
repexlab project remove -n vm1
```
