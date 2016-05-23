[![Build Status](https://travis-ci.org/q-nick/npm-gui.svg)](https://travis-ci.org/q-nick/npm-gui)
# [npm-gui](http://q-nick.github.io/npm-gui/)
![npm-gui screen](http://q-nick.github.io/npm-gui/030.png)
### Installation
```
npm install npm-gui
```
or
```
npm install -g npm-gui
```

### How to use

Open terminal and go to folder with ```package.json``` file and type ```npm-gui``` (if installed globally) or ```./node_modules/npm-gui/bin/npm-gui``` (if installed locally).
Now you should be able to open GUI in your browser - navigate to http://localhost:1337/

If you need to start server on another host, port, you should add host:port argument to command, example:

```
npm-gui localhost:9000
```

### Welcome
npm-gui is a GUI tool for NodeJS based projects. The main key is to easily work with package.json and node_modules folder. Even developers who aren't familiar with task runner like Gulp and GruntJS won't have any problems.
For now npm-gui contain a few modules:
- dependencies manager for:
    - regular packages
    - development packages
- tasks manager
- command builder (based on npm packages)
- console based on websocket communication

### How it works
npm-gui is starting simple webserver from folder of your project. Webserver is a core, for example it:
- serve GUI for browser (it is available by default on: http://localhost:1337/)
- modify package.json
- run commands from client side application (example: "npm install angular --save" when you want to add angular to your project)
- pushing console logs through websocket to client side application

### Dependencies features
- shows all types of versions:
    - saved in package.json,
    - installed (if is different - you can save it in package.json)
    - wanted (newest compatible version - you can install it and save by click)
    - latest
- checks nsp errors (nodesecurity.io) - currently works only for regular dependencies

### Another task runner?
No it's not another task runner, package manager etc. It's based on native npm mechanism to install/uninstall/search packages.

### Authors and Contributors
@q-nick
