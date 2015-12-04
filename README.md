# kufa
### Welcome
Kufa is a GUI tool for NodeJS based projects. The main key is to easily work with package.json and node_modules folder even for developers who arent familiar with task runner like Gulp and GruntJS. 
For now Kufa contain few GUI modules:
- dependencies manager
- devDependencies manager
- scripts editor
- scripts builder (based on npm packages)
- console based on websocket communication

### How it works
Kufa is starting simple webserver from folder of your project. Webserver is a core, for example it: 
- serve GUI for browser (it is available by default on: http://localhost:1337/)
- modify package.json
- run commands from client side application (example: "npm install angular --save" when you want to add angular to your project)
- pushing console logs through websocket to client side application

### Another task runner?
No it's not!!! By design it`s not another task runner, package manager etc. It's based on native npm mechanism to install/uninstall/search packages.

### Authors and Contributors
@q-nick
