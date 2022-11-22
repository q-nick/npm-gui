# [npm-gui](http://q-nick.github.io/npm-gui/)

[![Build Status](https://travis-ci.org/q-nick/npm-gui.svg)](https://travis-ci.org/q-nick/npm-gui) <a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/dm/npm-gui.svg" alt="Downloads"></a> <a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/v/npm-gui.svg" alt="Version"></a> <a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/l/npm-gui.svg" alt="License"></a>

#

![npm-gui main screen](/readme/main-page.png)

#

## About

`npm-gui` is a convenient tool for managing javascript project dependencies listed in `package.json`. Under the hood, it will transparently use `npm`, `pnpm`, or `yarn` commands to install, remove or update dependencies
(_to use **yarn** it requires the **yarn.lock** file to be present in project folder._)

- global and project dependencies management
- npm, yarn, and pnpm support
- security scoring per package
- package details (homepage, repository)
- upgrading package version
- downgrading package version
- search and install new dependencies

#

## Supported engines:

| lang   | manager  | status |
| ------ | -------- | ------ |
| js     | npm      | ✔️     |
| js     | yarn     | ✔️     |
| js     | pnpm     | ✔️     |
| python | pip      | ❌     |
| php    | composer | ❌     |

#

## Getting Started

The simplest way to run `npm-gui` is by using <a href="https://www.npmjs.com/package/npx">`npx`</a>:

```
~/$ npx npm-gui
```

It will run the most recent version of `npm-gui` without installing it on your system.

### Installation

`npm-gui` could also be installed as a global dependency:

```
npm install -g npm-gui
```

or locally:

```
npm install npm-gui
```

### How to use

`npm-gui` app will be accessible in the browser at the link http://localhost:13377/. Remember to first use the command below:

```
~/$ npx npm-gui
```

By default, the app will use the folder in which you started the command. Then you could navigate to the folder containing your project (containing `package.json`).
![npm-gui navigation](/readme/navigation-2-zoom-creat-vista.gif)

Or you could run the `npm-gui` command in your desired folder:

```
~/workspace/project1$ npm-gui
```

If you need to start the app on another `host/port` you could add a `host:port` argument to the command, for example:

```
~/$ npm-gui localhost:9000
```

#### Starting

#### Navigating between projects

To change the project press the **folder icon** in the top-right corner. The navigation panel will allow you to change the folder - it must contain the **yarn.lock or package.json** file to be chosen.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/navigation.gif)

#### Installing new dependencies

To install a new dependency you can use the **search/add button**. After typing the name of the dependency in input - press the search button - results will appear on the list below. You must also decide whether will dependency be installed as production or development. After the successful installation of the new dependency, it will appear on the project list.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/installing.gif)

#### Removing dependencies

To remove dependency from your project simply press the **trash icon** on the right.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/removing.gif)

#### Updating selected dependencies

- TODO

#### Updating all dependencies as...

To do a batch dependencies update and save new versions to package.json, for example, _wanted_, press one of the green buttons above the list of project dependencies.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/batch-update.gif)

## Authors and Contributors

@q-nick
