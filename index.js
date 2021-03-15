#!/usr/bin/env node

// running npm-gui development version
const {start} = require('./dist/index.js');

const args = process.argv.slice(2);
let host = null;
let port = null;
if (args[0]) {
  host = args[0].split(':')[0];
  port = args[0].split(':')[1];
}
start(host, port || 13377, true);
