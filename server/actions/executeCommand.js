import spawn from 'cross-spawn';
import Console from '../console';

export default function executeCommand(cwd, wholeCommand, pushToConsole) {
  return new Promise((resolve, reject) => {
    // spawn process
    const args = wholeCommand.split(' ');
    const command = args.shift();
    const spawned = spawn(command, args, { cwd });
    const commandId = new Date().getTime();
    if (pushToConsole) {
      console.log(`executing: "${wholeCommand}" in "${cwd}"\n`);
      Console.send(`executing: "${wholeCommand}" in "${cwd}"\n`, commandId);
    }

    // wait for stdout, stderr
    let stdout = '';
    spawned.stdout.on('data', (data) => {
      stdout += data.toString();
      // send part data through socket if required
      if (pushToConsole) { Console.send(data.toString(), commandId); }
    });

    let stderr = '';
    spawned.stderr.on('data', (data) => {
      stderr += data.toString();
      // TODO send as stderr and show red color
      if (pushToConsole) { Console.send(data.toString(), commandId); }
    });

    // wait for finish and resolve
    spawned.on('close', () => {
      resolve({
        stdout,
        stderr,
      });
    });

    // if error
    spawned.on('error', () => {
      reject(new Error({
        stdout,
        stderr,
      }));
    });
  });
}
