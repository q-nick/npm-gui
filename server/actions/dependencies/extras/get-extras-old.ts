import type { Details } from '../../../types/commands.types';
import type { ResponserFunction } from '../../../types/new-server.types';
import { executeCommandJSONWithFallback } from '../../execute-command';

interface Parameters {
  dependencyNameVersion: string;
}

const getExtrasNpm = async (
  dependencyNameVersion: string,
): Promise<Details> => {
  const details = await executeCommandJSONWithFallback<Details>(
    undefined,
    `npm view ${dependencyNameVersion} --json`,
  );

  return {
    versions: details.versions,
    homepage: details.homepage,
    repository: details.repository,
    dist: { unpackedSize: details.dist.unpackedSize },
    time: details.time,
  };
};

const getExtrasPnpm = async (
  dependencyNameVersion: string,
): Promise<Details> => {
  const details = await executeCommandJSONWithFallback<Details>(
    undefined,
    `pnpm view ${dependencyNameVersion} --json`,
  );

  return {
    versions: details.versions,
    homepage: details.homepage,
    repository: details.repository,
    dist: { unpackedSize: details.dist.unpackedSize },
    time: details.time,
  };
};

const getExtrasYarn = async (
  dependencyNameVersion: string,
): Promise<Details> => {
  // type
  const details = await executeCommandJSONWithFallback<Details>(
    undefined,
    `yarn info ${dependencyNameVersion} --json`,
  );

  return {
    versions: details.versions,
    homepage: details.homepage,
    repository: details.repository,
    dist: { unpackedSize: details.dist.unpackedSize },
    time: details.time,
  };
};

export const getExtras: ResponserFunction<
  unknown,
  Parameters,
  Details | never[]
> = async ({ params: { dependencyNameVersion }, extraParams: { manager } }) => {
  try {
    if (manager === 'yarn') {
      return await getExtrasYarn(dependencyNameVersion);
    } else if (manager === 'pnpm') {
      return await getExtrasPnpm(dependencyNameVersion);
    }
    return await getExtrasNpm(dependencyNameVersion);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    return [];
  }
};
