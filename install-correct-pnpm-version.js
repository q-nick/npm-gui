/* eslint-disable no-console */
const { execSync } = require('child_process');

const version = /v(?<major>\d+)\./.exec(process.version);
if (+version.major > 12) {
  console.log(execSync('npm install -g pnpm').toString());
} else {
  console.log(execSync('npm install -g pnpm@5').toString());
}
console.log('pnpm installed:', execSync('pnpm -v').toString());

console.log(...process.argv);
