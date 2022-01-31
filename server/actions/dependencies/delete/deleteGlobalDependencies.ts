import type { ResponserFunction } from '../../../newServerTypes';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommand } from '../../executeCommand';

const deleteGlobalNpmDependency = async (
  dependencyName: string,
): Promise<void> => {
  await executeCommand(undefined, `npm uninstall ${dependencyName} -g`, true);
};

export const deleteGlobalDependency: ResponserFunction = async ({
  params: { dependencyName },
  extraParams: { xCacheId },
}) => {
  if (dependencyName === undefined) {
    throw new Error('no depednency name');
  }

  await deleteGlobalNpmDependency(dependencyName);

  spliceFromCache(`${xCacheId}global`, dependencyName);

  return {};
};
