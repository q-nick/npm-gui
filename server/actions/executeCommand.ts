import spawn from 'cross-spawn';
import { ZERO } from '../utils/utils';

const Console = { send(...args: any[]) {args;} }; // eslint-disable-line

export async function executeCommand(
  cwd: string | undefined, wholeCommand: string, pushToConsole = false,
): Promise<{ stdout: string; stderr: string }> {
  console.log(`Command: ${cwd ?? ''} ${wholeCommand}, started:`);
  return new Promise((resolve, reject) => {
    // spawn process
    const args = wholeCommand.split(' ');
    const command = args.shift();
    if (command === undefined) {
      reject(new Error('command not passed'));
    } else {
      const spawned = spawn(command, args, { cwd, detached: false });
      const commandId = new Date().getTime().toString();
      // console.log(`executing: "${wholeCommand}" in "${cwd}"\n`, commandId);
      if (pushToConsole) {
        Console.send(`executing: "${wholeCommand}" in "${cwd ?? 'global'}"\n`, commandId);
      }

      // wait for stdout, stderr
      let stdout = '';
      spawned.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
        // send part data through socket if required
        if (pushToConsole) {
          Console.send(data.toString(), commandId);
        }
      });

      let stderr = '';
      spawned.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
        // TODO send as stderr and show red color
        if (pushToConsole) {
          Console.send(data.toString(), commandId);
        }
      });

      // wait for finish and resolve
      spawned.on('close', (exitStatus: number) => {
        console.log(exitStatus);
        if (exitStatus === ZERO) {
          resolve({
            stdout,
            stderr,
          });
        } else {
          reject(stdout+stderr); // eslint-disable-line
        }
        // if (pushToConsole) {
        //   Console.send('', commandId, exitStatus === 0 ? 'CLOSE' : 'ERROR');
        // }
        // resolve({
        //   stdout,
        //   stderr,
        // });
      });

      // if error
      spawned.on('error', () => {
        if (pushToConsole) {
          Console.send('', commandId, 'ERROR');
        }
        reject(new Error(stderr));
      });
    }
  });
}

export async function executeCommandSimple(
  cwd: string | undefined, wholeCommand: string, pushToConsole = false,
): Promise<string> {
  const { stdout } = await executeCommand(cwd, wholeCommand, pushToConsole);
  return stdout;
}

export async function executeCommandJSON<T>(
  cwd: string | undefined, wholeCommand: string, pushToConsole = false,
): Promise<T> {
  const { stdout } = await executeCommand(cwd, wholeCommand, pushToConsole);
  return JSON.parse(stdout) as T;
}

export async function executeCommandJSONWithFallback<T>(
  cwd: string | undefined, wholeCommand: string, pushToConsole = false,
): Promise<T> {
  try {
    const { stdout } = await executeCommand(cwd, wholeCommand, pushToConsole);
    console.log('OK:');
    return stdout ? JSON.parse(stdout) as T : {} as T;
  } catch (err: unknown) {
    console.log('ERROR:');
    return JSON.parse(err as string) as T;
  }
}

export async function executeCommandJSONWithFallbackYarn<T>(
  cwd: string | undefined, wholeCommand: string, pushToConsole = false,
): Promise<T | undefined> {
  try {
    const { stdout, stderr } = await executeCommand(cwd, wholeCommand, pushToConsole);
    console.log('OK:');
    const JSONs = (stdout + stderr).trim()
      .split('\n')
      .filter((x) => x)
      .map((r) => JSON.parse(r)); // eslint-disable-line
    const table = JSONs.find((x) => 'type' in x && x.type === 'table') as T | undefined; // eslint-disable-line
    if (table) { return table; }

    const anyError = JSONs.find((x) => 'type' in x && x.type === 'error') as T | undefined; // eslint-disable-line
    if (anyError) { return anyError; }
  } catch (err: unknown) {
    console.log('ERROR:');

    if (typeof err === 'string') {
      const JSONs = err.trim()
        .split('\n')
        .filter((x) => x)
      .map((r) => JSON.parse(r)); // eslint-disable-line
      const table = JSONs.find((x) => 'type' in x && x.type === 'table') as T | undefined; // eslint-disable-line
      if (table) { return table; }

      const anyError = JSONs.find((x) => 'type' in x && x.type === 'error') as T | undefined; // eslint-disable-line
      if (anyError) { return anyError; }
    }

    return JSON.parse(err as string) as T;
  }

  return undefined;
}
