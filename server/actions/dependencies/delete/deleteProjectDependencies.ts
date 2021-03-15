import type { ResponserFunction } from '../../../newServerTypes';
import type * as Dependency from '../../../types/Dependency';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommandSimple } from '../../executeCommand';

const commandTypeFlag = {
  prod: '-S',
  dev: '-D',
  global: '-g',
  extraneous: '',
};

async function deleteNpmDependency(
  projectPath: string | undefined, packageName: string, type: Dependency.Type,
): Promise<void> {
  // delete
  await executeCommandSimple(projectPath, `npm uninstall ${packageName} ${commandTypeFlag[type]}`, true);
}

async function deleteYarnDependency(
  projectPath: string | undefined, packageName: string,
): Promise<void> {
  // delete
  try {
    await executeCommandSimple(projectPath, `yarn remove ${packageName}`, true);
  } catch (err: unknown) {
    // we are caching error it's unimportant in yarn
    console.log(err);
  }
}

export const deleteDependency: ResponserFunction = async ({
  params: { type = 'global', dependencyName = 'undefined' },
  extraParams: { projectPathDecoded, yarnLock },
}) => {
  if (yarnLock) {
    await deleteYarnDependency(projectPathDecoded, dependencyName);
  } else {
    await deleteNpmDependency(projectPathDecoded, dependencyName, type as any);
  }

  spliceFromCache(projectPathDecoded, dependencyName);

  return {};
};
