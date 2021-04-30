import { executeCommandSimple } from './executeCommand';

function ansiRegex(): RegExp {
  const pattern = [
    '[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
    '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))',
  ].join('|');

  return new RegExp(pattern, 'g');
}

export async function executePnpmOutdated(
  outdatedInfo: any, projectPath: string, compatible = false, // eslint-disable-line
): Promise<void> {
  try {
    await executeCommandSimple(projectPath, `pnpm outdated ${compatible ? '--compatible' : ''} --no-table`);
  } catch (result: unknown) {
    if (typeof result === 'string') {
      const rows = result.replace(ansiRegex(), '').split('\n');
      let name = '';
      rows.forEach((row) => {
        const rowResult = /=>.([\d.]+)/.exec(row);
        if (rowResult) {
          // eslint-disable-next-line
          outdatedInfo[name] = {
            ...outdatedInfo[name], // eslint-disable-line
            [compatible ? 'wanted' : 'latest']: rowResult[1],
          };
        } else {
          name = row.replace('(dev)', '').trim();
        }
      });
    }
  }
}
