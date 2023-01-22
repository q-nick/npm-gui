#!/usr/bin/env node

// running npm-gui development version
const { start } = require('./dist/server');

const [processArguments] = process.argv.slice(2);
let host = null;
let port = null;

if (processArguments) {
  [host, port] = processArguments.split(':');
}

start(host || 'localhost', port || 13377, true);
