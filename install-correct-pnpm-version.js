/* eslint-disable no-console */
const { execSync } = require('child_process');

const version = /v(?<major>\d+)/.exec(process.version);
console.log('installing:', version, +version.groups.major, process.version);
if (+version.groups.major > 14) {
  console.log(execSync('npm install -g pnpm').toString());
} else if (+version.groups.major > 12) {
  console.log(execSync('npm install -g pnpm@6').toString());
} else {
  console.log(execSync('npm install -g pnpm@5').toString());
}
console.log('pnpm installed:', execSync('pnpm -v').toString());
