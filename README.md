# [npm-gui](http://q-nick.github.io/npm-gui/)

[![CI Build Test](https://github.com/q-nick/npm-gui/actions/workflows/build.yml/badge.svg)](https://github.com/q-nick/npm-gui/actions/workflows/build.yml)
[![CI Linux](https://github.com/q-nick/npm-gui/actions/workflows/linux.yml/badge.svg)](https://github.com/q-nick/npm-gui/actions/workflows/linux.yml)
[![CI MacOS](https://github.com/q-nick/npm-gui/actions/workflows/macos.yml/badge.svg)](https://github.com/q-nick/npm-gui/actions/workflows/macos.yml)
[![CI Windows](https://github.com/q-nick/npm-gui/actions/workflows/windows.yml/badge.svg)](https://github.com/q-nick/npm-gui/actions/workflows/windows.yml)

<a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/dm/npm-gui.svg" alt="Downloads"></a>
<a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/v/npm-gui.svg" alt="Version"></a>
<a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/l/npm-gui.svg" alt="License"></a>

![](readme/batch-install.GIF)

## About

`npm-gui` is a convenient tool for managing javascript project dependencies listed in `package.json`. Under the hood, it will transparently use `npm`, `pnpm`, or `yarn` commands to install, remove or update dependencies
(_to use **yarn** it requires the **yarn.lock** file to be present in the project folder._)

- [x] global and project dependencies management
- [x] npm, yarn, and pnpm support
- [x] security scoring per package
- [x] package details (homepage, repository, version history)
- [x] upgrading package version
- [x] downgrading package version
- [x] search and install new dependencies

## Supported engines:

| npm | yarn | pnpm | pip | composer |
| --- | ---- | ---- | --- | -------- |
| ✔️  | ✔️   | ✔️   | ❌  | ❌       |

## Getting Started

The recommended way to run `npm-gui` is by using <a href="https://www.npmjs.com/package/npx">`npx`</a>:

```
~/$ npx npm-gui
```

It will run the most recent version of `npm-gui` without installing it on your system.

#### Installation as global dependency

`npm-gui` could also be installed as a global dependency:

```
~/$ npm install -g npm-gui
```

and then run with just:

```
~/$ npm-gui
```

#### Installation as local dependency (not-recommended)

```
~/$ npm install npm-gui
```

### How to use

`npm-gui` app will be accessible in the browser at the link http://localhost:13377/. Remember to first use the command below:

```
~/$ npx npm-gui
```

By default, the app will use the folder in which you started the command. Then you could navigate to the folder containing your project (containing `package.json`).

![npm-gui navigation](readme/open.GIF)

Or you could run the `npm-gui` command in your desired folder:

```
~/workspace/project1$ npx npm-gui
```

If you need to start the app on another `host/port` you could add a `host:port` argument to the command, for example:

```
~/$ npx npm-gui localhost:9000
```

## Navigating between projects

To change the project press the **folder icon** in the top-right corner. The navigation panel will allow you to change the folder - it must contain the **yarn.lock or package.json** file to be chosen.

![](readme/open.GIF)

## Installing new dependencies

To install a new dependency use input named _find a new package_ and search button - results will appear on the list below. You must also decide whether will dependency be installed as production or development. After the successful installation of the new dependency, it will appear on the project list.

![](readme/install-new.GIF)

## Removing dependencies

To remove dependency from your project press the **trash icon** on the right and green install button to confirm action.

![](readme/deleting.GIF)

## Updating dependencies

To do a batch dependencies update and save new versions to package.json, for example, _compatible_, press one of the green buttons above the column of project dependencies.

![](readme/batch-install.GIF)

## Additional dependencies details

### Security scoring

### Size details

### Last update

### Other versions

## Authors and Contributors

@q-nick
