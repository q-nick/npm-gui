const { spawnSync } = require("child_process");

const version = /v(\d+)\./.exec(process.version);
if (+version[1] >= 12) {
  spawnSync('npm',['install','-g', 'pnpm']).output.toString();
} else {
  spawnSync('npm',['install','-g', 'pnpm@5']).output.toString();
}
console.log('pnpm installed: ',spawnSync('pnpm', ['-v']).output.toString());
