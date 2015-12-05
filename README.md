# npm-gui
### Installation
```
npm install npm-gui
```
or
```
npm install -g npm-gui
```

### Welcome
NPM-GUI is a GUI tool for NodeJS based projects. The main key is to easily work with package.json and node_modules folder. Even developers who aren't familiar with task runner like Gulp and GruntJS should won't have any problems. 
For now NPM-GUI contain a few modules:
- dependencies manager
- devDependencies manager
- scripts editor
- scripts builder (based on npm packages)
- console based on websocket communication

### How it works
NPM-GUI is starting simple webserver from folder of your project. Webserver is a core, for example it: 
- serve GUI for browser (it is available by default on: http://localhost:1337/)
- modify package.json
- run commands from client side application (example: "npm install angular --save" when you want to add angular to your project)
- pushing console logs through websocket to client side application

### Another task runner?
No it's not another task runner, package manager etc. It's based on native npm mechanism to install/uninstall/search packages.

### Authors and Contributors
@q-nick
