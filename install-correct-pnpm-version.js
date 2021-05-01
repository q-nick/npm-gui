const { execSync } = require("child_process");

const version = /v(\d+)\./.exec(process.version);
if (+version[1] > 12) {
  console.log(execSync('npm install -g pnpm').toString());
} else {
  console.log(execSync('npm install -g pnpm@5').toString());
}
console.log('pnpm installed: ', execSync('pnpm -v').toString());
