function uniqueOrNull(value: string, comparision: string[]): string {
  return comparision.includes(value) ? null : value;
}

export function mapNpmDependency(
  name: string,
  dependency: Dependency.Basic,
  version: Dependency.Version,
  required: string,
  type: Dependency.Type,
  repo: 'npm' | 'yarn' = 'npm'): Dependency.Entire {
  const installed = (dependency && dependency.version) || null;
  let wanted = version ? uniqueOrNull(version.wanted, [installed]) : null;
  const latest = version ? uniqueOrNull(version.latest, [installed, wanted]) : null;
  if (!installed && !wanted && required) {
    [wanted] = required.match(/\d.+/);
  }
  return {
    name,
    required,
    installed,
    wanted,
    latest,
    type,
    repo,
  };
}

export function mapBowerDependency(
  name: string, dependency: Dependency.Bower, type: Dependency.Type): Dependency.Entire {
  return {
    name,
    type,
    repo: 'bower',
    required: dependency.endpoint.target,
    installed: dependency.pkgMeta ? dependency.pkgMeta.version : null,
    wanted: uniqueOrNull(
      dependency.update.target,
      [dependency.pkgMeta && dependency.pkgMeta.version],
    ),
    latest: uniqueOrNull(
      dependency.update.latest,
      [dependency.pkgMeta && dependency.pkgMeta.version],
    ),
  };
}

export function mapYarnDependencyToDependency(yarnDependency: Yarn.ResultDependency)
  : Dependency.Entire {
  return {
    name: yarnDependency[0],
    required: null,
    installed: yarnDependency[1],
    wanted: yarnDependency[2],
    latest: yarnDependency[3],
    type: null,
    repo: 'yarn',
  };
}

export function mapYarnResultTreeToBasic(yarnResults: Yarn.Result[]): { [key: string]: Dependency.Basic } { // tslint:disable:max-line-length
  const dependencies: { [key: string]: Dependency.Basic } = {};

  yarnResults
    .filter((r: any): r is Yarn.ResultTree => r.type === 'tree')
    .map((yarnTree) => {
      yarnTree.data.trees.forEach((yarnDependency) => {
        dependencies[yarnDependency.name.substr(0, yarnDependency.name.lastIndexOf('@'))] = {
          name: yarnDependency.name.substr(0, yarnDependency.name.lastIndexOf('@')),
          version: yarnDependency.name.substr(yarnDependency.name.lastIndexOf('@') + 1),
        };
      });
    });

  return dependencies;
}

export function mapYarnResultTableToVersion(yarnResults: Yarn.Result[]): { [key: string]: Dependency.Version } { // tslint:disable:max-line-length
  const dependencies: { [key: string]: Dependency.Version } = {};

  yarnResults
    .filter((r: any): r is Yarn.ResultTable => r.type === 'table')
    .map((yarnTable) => {
      yarnTable.data.body.forEach((yarnDependency) => {
        dependencies[yarnDependency[0]] = {
          wanted: yarnDependency[2],
          latest: yarnDependency[3],
        };
      });
    });

  return dependencies;
}
