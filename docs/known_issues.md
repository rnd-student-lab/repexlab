# Known issues

## Additional documentation

This document is the list of Virtstand known issues and possible solutions to those issues. There are more documentation files in
[`docs` in the Virtstand source tree](./):

- [Virtual Machine commands](./commands_vm.md)
- [Project commands](./commands_project.md)
- [Examples](./examples.md)
- [Known issues](./known_issues.md)


## Content

### Absolute path conversion when calling `vm copy` from CLI

There is an issue with POSIX-to-Windows path conversion.
MSYS (windows shell) changes absolute paths, see [this](https://github.com/git-for-windows/git/issues/577#issuecomment-166118846) and [that](https://stackoverflow.com/questions/7250130/how-to-stop-mingw-and-msys-from-mangling-path-names-given-at-the-command-line) for more info.
Use `MSYS_NO_PATHCONV=1` to avoid the issue.
