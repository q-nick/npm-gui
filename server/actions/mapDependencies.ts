import type * as Dependency from '../Dependency';
import type * as Commands from '../Commands';

export function uniqueOrNull(
  value: string, comparision: (string|null|undefined)[],
): string | null {
  return comparision.includes(value) ? null : value;
}

export function mapNpmDependency2(
  dependency: Dependency.Npm,
  version: Commands.OutdatedBody,
  required: string | null,
): Dependency.Entire {
  const installed = dependency.version !== undefined ? dependency.version : null;
  let wanted = version ? uniqueOrNull(version.wanted, [installed]) : null;
  const latest = version ? uniqueOrNull(version.latest, [installed, wanted]) : null;

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
    repo: 'npm',
  };
}

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

export function getInstalledVersion(installed?: Commands.InstalledBody): string | null {
  if (!installed) {
    return null;
  }

  if ('version' in installed) {
    return installed.version;
  }

  if (typeof installed.required === 'string') {
    return null;
  }

  return installed.required.version; // TODO peerMissing
}

export function getWantedVersion(
  installed: string | null, outdated?: Commands.OutdatedBody,
): string | null {
  if (installed !== null || !outdated) {
    return null;
  }

  return uniqueOrNull(outdated.wanted, [installed]);
}

export function getLatestVersion(
  installed: string | null, wanted: string | null, outdated?: Commands.OutdatedBody,
): string | null {
  if (installed !== null || !outdated) {
    return null;
  }

  return uniqueOrNull(outdated.latest, [installed, wanted]);
}
