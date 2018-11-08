#!/usr/bin/env node

// running npm-gui development version
const npmGuiServer = require('./dist/server/main.js').default;

const args = process.argv.slice(2);
let host = null;
let port = null;
if (args[0]) {
  host = args[0].split(':')[0];
  port = args[0].split(':')[1];
}
npmGuiServer(host, port);
