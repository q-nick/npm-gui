import type { ResponserFunction } from '../../../types/new-server.types';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommand } from '../../execute-command';

const deleteGlobalNpmDependency = async (
  dependencyName: string,
): Promise<void> => {
  await executeCommand(undefined, `npm uninstall ${dependencyName} -g`);
};

interface Parameters {
  dependencyName: string;
}

export const deleteGlobalDependency: ResponserFunction<
  unknown,
  Parameters
> = async ({ params: { dependencyName }, extraParams: { xCacheId } }) => {
  await deleteGlobalNpmDependency(dependencyName);

  spliceFromCache(`${xCacheId}global`, dependencyName);

  return {};
};
