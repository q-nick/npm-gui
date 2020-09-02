import spawn from 'cross-spawn';

import * as Console from '../console';
import { parseJSON } from './parseJSON';

export default function executeCommand(
  cwd:string | null, wholeCommand:string, pushToConsole = false,
):Promise<{ stdout: string, stderr:string}> {
  return new Promise((resolve, reject) => {
    // spawn process
    const args = wholeCommand.split(' ');
    const command = args.shift();
    const spawned = spawn(command!, args, { cwd: cwd as any, detached: false });
    const commandId = new Date().getTime().toString();
    // console.log(`executing: "${wholeCommand}" in "${cwd}"\n`, commandId);
    if (pushToConsole) {
      Console.send(`executing: "${wholeCommand}" in "${cwd}"\n`, commandId);
    }

    // wait for stdout, stderr
    let stdout = '';
    spawned.stdout.on('data', (data:Buffer) => {
      stdout += data.toString();
      // send part data through socket if required
      if (pushToConsole) { Console.send(data.toString(), commandId); }
    });

    let stderr = '';
    spawned.stderr.on('data', (data:Buffer) => {
      stderr += data.toString();
      // TODO send as stderr and show red color
      if (pushToConsole) { Console.send(data.toString(), commandId); }
    });

    // wait for finish and resolve
    spawned.on('close', (exitStatus:number) => {
      if (pushToConsole) { Console.send('', commandId, exitStatus === 0 ? 'CLOSE' : 'ERROR'); }
      resolve({
        stdout,
        stderr,
      });
    });

    // if error
    spawned.on('error', () => {
      if (pushToConsole) { Console.send('', commandId, 'ERROR'); }
      reject(new Error(stderr));
    });
  });
}

export async function executeCommandJSON(
  cwd:string, wholeCommand:string, pushToConsole = false,
):Promise<any> {
  try {
    const { stdout } = await executeCommand(cwd, wholeCommand, pushToConsole);
    return parseJSON(stdout);
  } catch (e) {
    return null;
  }
}
