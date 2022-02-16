# Repexlab

Repexlab (reproducible experiment laboratory) is a CLI instrument providing a framework for conducting experiments on software quality in virtual environment.
It provides means to setup the experiment project and to apply various virtual environment configurations at the specified experiment stages.

Main feature are:

* Project bootstrapping.
* Scaffolding for managing virtual machine configurations within the project.
* CLI for managing the virtual environment while devoloping the experiment.
* Task automation for managing the virtual environment while conducting the experiment.
* Virtual machine resource utilization reporting.

## Installation

TBD.

## Requirements

* Virtualbox >=6.1.30
* Vagrant >=2.2.19
* Node.JS >=14.5.0
* NPM >=6.14.5

## Documentation

### Table of contents

* [Virtual Machine commands](/docs/commands_vm.md)
* [Project commands](/docs/commands_project.md)
* [Examples](/docs/examples.md)
* [Known issues](/docs/known_issues.md)

## Development

* clone repo
* `npm install`
* either run `npm run build:link` and `repexlab`
* or `npm run build` and `node build/index`

## License

MIT © Dmitry Ilin
