import type { InstalledBody, OutdatedBody } from '../types/commands.types';
import type { Entire, Npm } from '../types/dependency.types';

export const uniqueOrNull = (
  value: string | undefined,
  comparision: (string | null | undefined)[],
): string | null => {
  if (value === undefined) {
    return null;
  }

  return comparision.includes(value) ? null : value;
};

export const mapNpmDependency2 = (
  dependency: Npm,
  version: OutdatedBody,
  required: string | null,
): Entire => {
  const installed =
    dependency.version !== undefined ? dependency.version : null;
  let wanted = version ? uniqueOrNull(version.wanted, [installed]) : null;
  const latest = version
    ? uniqueOrNull(version.latest, [installed, wanted])
    : null;

  if (installed === null && wanted === null && required !== null) {
    const match = /\d.+/.exec(required);
    [wanted] = match ?? [null];
  }

  return {
    ...dependency,
    required,
    installed: installed ?? undefined,
    wanted: wanted ?? undefined,
    latest: latest ?? undefined,
    manager: 'npm',
  };
};

// export function mapYarnDependencyToDependency(
//   yarnDependency: Yarn.ResultDependency, unused: boolean,
// ): Dependency.Entire {
//   return {
//     unused,
//     name: yarnDependency[0],
//     required: undefined,
//     installed: yarnDependency[1],
//     wanted: yarnDependency[2],
//     latest: yarnDependency[3],
//     type: 'prod',
//     repo: 'yarn',
//   };
// }

// export function mapYarnResultTreeToBasic(
//   yarnResults: Yarn.Result[],
// ): Record<string, Dependency.Basic> {
//   const dependencies: Record<string, Dependency.Basic> = {};

//   yarnResults
//     .filter((r: any): r is Yarn.ResultTree => r.type === 'tree')
//     .forEach((yarnTree) => {
//       yarnTree.data.trees.forEach((yarnDependency) => {
//         dependencies[yarnDependency.name.substr(0, yarnDependency.name.lastIndexOf('@'))] = {
//           name: yarnDependency.name.substr(0, yarnDependency.name.lastIndexOf('@')),
//           version: yarnDependency.name.substr(yarnDependency.name.lastIndexOf('@') + 1),
//         };
//       });
//     });

//   return dependencies;
// }

// export function mapYarnResultTableToVersion(
//   yarnResults: Yarn.Result[],
// ): Record<string, Dependency.Version> {
//   const dependencies: Record<string, Dependency.Version> = {};

//   yarnResults
//     .filter((r: any): r is Yarn.ResultTable => r.type === 'table')
//     .forEach((yarnTable) => {
//       yarnTable.data.body.forEach((yarnDependency) => {
//         dependencies[yarnDependency[0]] = {
//           wanted: yarnDependency[2],
//           latest: yarnDependency[3],
//         };
//       });
//     });

//   return dependencies;
// }

export const getInstalledVersion = (
  installed?: InstalledBody,
): string | null => {
  if (!installed) {
    return null;
  }

  if ('version' in installed) {
    return installed.version;
  }

  if (typeof installed.required === 'string') {
    return null;
  }

  // TODO peerMissing
  return installed.required.version;
};

export const getWantedVersion = (
  installed: string | null | undefined,
  outdated?: { wanted?: string; latest?: string },
): string | null => {
  if (installed === null || !outdated) {
    return null;
  }

  return uniqueOrNull(outdated.wanted, [installed]);
};

export const getLatestVersion = (
  installed: string | null | undefined,
  wanted: string | null | undefined,
  outdated?: { wanted?: string; latest?: string },
): string | null => {
  if (installed === null || !outdated) {
    return null;
  }

  return uniqueOrNull(outdated.latest, [installed, wanted]);
};
