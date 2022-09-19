import type { Installed, Outdated } from '../../../types/commands.types';
import type { DependencyInstalled } from '../../../types/dependency.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { updateInCache } from '../../../utils/cache';
import {
  getInstalledVersion,
  getLatestVersion,
} from '../../../utils/map-dependencies';
import {
  executeCommand,
  executeCommandJSONWithFallback,
} from '../../execute-command';

const addGlobalNpmDependency = async ({
  name,
  version,
}: {
  name: string;
  version: string;
}): Promise<DependencyInstalled> => {
  // add
  await executeCommand(undefined, `npm install ${name}@${version || ''} -g`);

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

// eslint-disable-next-line @typescript-eslint/no-type-alias
type RequestBody = [{ name: string; version: string }];

export const addGlobalDependencies: ResponserFunction<RequestBody> = async ({
  body,
  extraParams: { xCacheId },
}) => {
  const dependency = await addGlobalNpmDependency(body[0]);
  updateInCache(`${xCacheId}global`, dependency);

  return {};
};
