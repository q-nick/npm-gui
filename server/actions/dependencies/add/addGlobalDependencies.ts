import type { Installed, Outdated } from '../../../Commands';
import type { ResponserFunction } from '../../../newServerTypes';
import type { Entire } from '../../../types/Dependency';
import { updateInCache } from '../../../utils/cache';
import {
  getInstalledVersion,
  getLatestVersion,
} from '../../../utils/mapDependencies';
import {
  executeCommand,
  executeCommandJSONWithFallback,
} from '../../executeCommand';

const addGlobalNpmDependency = async ({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<Entire> => {
  // add
  await executeCommand(
    undefined,
    `npm install ${name}@${version || ''} -g`,
    true,
  );

  // get package info
  const { dependencies: installedInfo } =
    await executeCommandJSONWithFallback<Installed>(
      undefined,
      `npm ls ${name} --depth=0 -g --json`,
    );

  const outdatedInfo = await executeCommandJSONWithFallback<Outdated>(
    undefined,
    `npm outdated ${name} -g --json`,
  );

  const installed = getInstalledVersion(
    installedInfo ? installedInfo[name] : undefined,
  );

  return {
    manager: 'npm',
    name,
    type: 'global',
    installed,
    latest: getLatestVersion(installed, null, outdatedInfo[name]),
  };
};

type RequestBody = [{ name: string; version: string }];

export const addGlobalDependencies: ResponserFunction<RequestBody> = async ({
  body,
  extraParams: { xCacheId },
}) => {
  const dependency = await addGlobalNpmDependency(body[0]);
  updateInCache(`${xCacheId}global`, dependency);

  return {};
};
