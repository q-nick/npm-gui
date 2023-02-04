import { spawn } from '../utils/simple-cross-spawn';
import { ZERO } from '../utils/utils';

export const executeCommand = (
  cwd: string | undefined,
  wholeCommand: string,
): Promise<{ stdout: string; stderr: string }> => {
  console.log(`Command: ${wholeCommand}, started`);
  return new Promise((resolve, reject) => {
    // spawn process
    const commandArguments = wholeCommand.split(' ');
    const command = commandArguments.shift();

    if (!command) {
      reject(new Error('command not passed'));
    } else {
      const spawned = spawn(command, commandArguments, {
        cwd,
        detached: false,
      });

      // wait for stdout, stderr
      let stdout = '';
      spawned.stdout?.on('data', (data: Buffer) => {
        stdout += data.toString();
      });

      let stderr = '';
      spawned.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      // wait for finish and resolve
      spawned.on('close', (exitStatus: number) => {
        if (exitStatus === ZERO) {
          resolve({
            stdout,
            stderr,
          });
        } else {
          reject(stdout + stderr);
        }
      });

      // if error
      spawned.on('error', () => {
        reject(stderr);
      });
    }
  });
};

export const executeCommandSimple = async (
  cwd: string | undefined,
  wholeCommand: string,
): Promise<string> => {
  const { stdout } = await executeCommand(cwd, wholeCommand);
  return stdout;
};

// eslint-disable-next-line func-style
export async function executeCommandJSONWithFallback<T>(
  cwd: string | undefined,
  wholeCommand: string,
): Promise<T> {
  try {
    const { stdout } = await executeCommand(cwd, wholeCommand);
    if (!process.env['NODE_TEST']) {
      console.log('OK:', wholeCommand);
    }
    return stdout ? (JSON.parse(stdout) as T) : ({} as T);
  } catch (error: unknown) {
    if (!process.env['NODE_TEST']) {
      console.log('ERROR:', wholeCommand, '\n', error);
    }
    return JSON.parse(
      (error as string).replace(/(\n{[\S\s]+)?npm ERR[\S\s]+/gm, ''),
    ) as T;
  }
}

// eslint-disable-next-line func-style, max-statements
export async function executeCommandJSONWithFallbackYarn<T>(
  cwd: string | undefined,
  wholeCommand: string,
): Promise<T | undefined> {
  try {
    const { stdout, stderr } = await executeCommand(cwd, wholeCommand);
    if (!process.env['NODE_TEST']) {
      console.log('OK:', wholeCommand);
    }
    const JSONs = (stdout + stderr)
      .trim()
      .split('\n')
      .filter((x) => x)
      .map((r) => JSON.parse(r));
    const table = JSONs.find((x) => 'type' in x && x.type === 'table') as
      | T
      | undefined;
    if (table) {
      return table;
    }

    const anyError = JSONs.find((x) => 'type' in x && x.type === 'error') as
      | T
      | undefined;
    if (anyError) {
      return anyError;
    }
  } catch (error: unknown) {
    if (!process.env['NODE_TEST']) {
      console.log('ERROR:', wholeCommand, '\n', error);
    }

    if (typeof error === 'string') {
      const JSONS = error
        .trim()
        .split('\n')
        .filter((x) => x)
        .map((r) => JSON.parse(r));
      const table = JSONS.find((x) => 'type' in x && x.type === 'table') as
        | T
        | undefined;
      if (table) {
        return table;
      }

      const anyError = JSONS.find((x) => 'type' in x && x.type === 'error') as
        | T
        | undefined;
      if (anyError) {
        return anyError;
      }
    }

    return JSON.parse(error as string) as T;
  }

  return undefined;
}
