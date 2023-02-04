import type { ChildProcess, SpawnOptionsWithoutStdio } from 'child_process';
import { spawn as cpSpawn } from 'child_process';

const metaCharsRegExp = /([ !"%&()*,;<>?[\]^`|])/g;

export const spawn = (
  command: string,
  arguments_?: readonly string[],
  options?: SpawnOptionsWithoutStdio,
): ChildProcess => {
  if (process.platform !== 'win32') {
    return cpSpawn(command, arguments_, options);
  }

  const shellCommand = [
    command,
    ...(arguments_ || []).map((argument) =>
      `"${argument}"`.replace(metaCharsRegExp, '^$1'),
    ),
  ].join(' ');

  return cpSpawn(
    process.env['comspec'] || 'cmd.exe',
    ['/d', '/s', '/c', `"${shellCommand}"`],
    {
      ...options,
      windowsVerbatimArguments: true,
    },
  );
};
