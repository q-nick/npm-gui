import type { ResponserFunction } from '../../../newServerTypes';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommand } from '../../executeCommand';

async function deleteGlobalNpmDependency(dependencyName: string): Promise<void> {
  await executeCommand(undefined, `npm uninstall ${dependencyName} -g`, true);
}

export const deleteGlobalDependency: ResponserFunction = async ({
  params: { dependencyName },
}) => {
  if (dependencyName === undefined) { throw new Error('no depednency name'); }

  await deleteGlobalNpmDependency(dependencyName);

  spliceFromCache('global', dependencyName);

  return {};
};
