const { execSync } = require("child_process");

const version = /v(\d+)\./.exec(process.version);
if (+version[1] > 12) {
  execSync('npm',['install','-g', 'pnpm']).output.toString();
} else {
  execSync('npm',['install','-g', 'pnpm@5']).output.toString();
}
console.log('pnpm installed: ',execSync('pnpm', ['-v']).output.toString());
