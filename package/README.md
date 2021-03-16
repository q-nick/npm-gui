# [npm-gui](http://q-nick.github.io/npm-gui/)

[![Build Status](https://travis-ci.org/q-nick/npm-gui.svg)](https://travis-ci.org/q-nick/npm-gui) <a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/dm/npm-gui.svg" alt="Downloads"></a> <a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/v/npm-gui.svg" alt="Version"></a> <a href="https://www.npmjs.com/package/npm-gui"><img src="https://img.shields.io/npm/l/npm-gui.svg" alt="License"></a>
#
![npm-gui main screen](https://github.com/q-nick/npm-gui/raw/gh-pages/screen-1-0-0.png)
#
## About
`npm-gui` is a tool for managing javascript project dependencies, which are listed in `package.json` or `bower.json` - in a friendly way. Under the hood it will use transparently `npm`, `bower` or `yarn` commands to install, remove or update dependencies
(*to use **yarn** it requires **yarn.lock** file to be present in project folder.*)


### **npm-gui** key features:
- global dependencies management
- project dependencies management
- project scripts runner
- npm, yarn, bower support

#
## Getting Started
Simplest way to run `npm-gui` is by using <a href="https://www.npmjs.com/package/npx">`npx`</a>:
```
~/$ npx npm-gui
```
It will run the newest version of `npm-gui` without installing it on your system.

### Installation
`npm-gui` could also be installed as global dependency:
```
npm install -g npm-gui
```
or locally:
```
npm install npm-gui
```

### How to use
`npm-gui` app will be accessible in browser under address http://localhost:1337/. Remember to first use a command below:

When installed as global dependency you could run `npm-gui` with command line:
```
~/$ npm-gui
```

Then you could navigate to folder containing your javascript project (including `package.json` or `bower.json`).
![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/navigation.gif)

Or you could run `npm-gui` command in you desired folder:
```
~/workspace/project1$ npm-gui
```
If you need to start app on another `host/port`, you could add `host:port` argument to command for example:
```
~/$ npm-gui localhost:9000
```

#### Starting

#### Navigating between projects
To change project press **folder icon** in top-right corner. Navigation panel will allow you to change folder - it must contain **yarn.lock, package.json or bower.json** file to be choosen.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/navigation.gif)

#### Installing new dependencies
To install new dependency you can use **search/add button**. After typing name of the dependency in input - press search button - results will appear on list below. You can switch here between **npm/bower** repository. You must also decide will dependency be installed as production or development. After successfull installation of new dependency it will appear on project list.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/installing.gif)

#### Removing dependencies
To remove depenedency from your project simply press **trash icon** on the right.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/removing.gif)

#### Updating selected dependencies
- TODO

#### Updating all dependencies as...
To do a batch dependencies update and save new versions to package.json, for example *wanted*, press one of the green button above list of project dependencies.

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/batch-update.gif)

#### Running scripts
- TODO

#### Removing scripts
- TODO

#### Enlarging console log
To get more readable log you can use enlarge button which will change width of console.

Consoles are not self-closing they will be visible until you close them with **remove button**

![](https://raw.githubusercontent.com/q-nick/npm-gui/gh-pages/video/console.gif)


#
## Authors and Contributors
@q-nick
