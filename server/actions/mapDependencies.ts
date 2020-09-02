function uniqueOrNull(value: string, comparision: (string|null|undefined)[]): string | undefined {
  return comparision.includes(value) ? undefined : value;
}

export function mapNpmDependency(
  name: string,
  dependency: Dependency.Basic,
  version: Dependency.Version,
  required: string | null,
  type: Dependency.Type | null,
  unused: boolean,
  repo: 'npm' | 'yarn' = 'npm',
): Dependency.Entire {
  const installed = (dependency && dependency.version) || null;
  let wanted = version ? uniqueOrNull(version.wanted, [installed]) : null;
  const latest = version ? uniqueOrNull(version.latest, [installed, wanted]) : null;

  if (!installed && !wanted && required) {
    const match = required.match(/\d.+/);
    [wanted] = match || [null];
  }

  return {
    name,
    required,
    installed: installed || undefined,
    wanted: wanted || undefined,
    latest: latest || undefined,
    type,
    repo,
    unused,
  };
}

export function mapBowerDependency(
  name: string, dependency: Dependency.Bower, type: Dependency.Type,
): Dependency.Entire {
  return {
    name,
    type,
    repo: 'bower',
    required: dependency.endpoint.target,
    installed: dependency.pkgMeta ? dependency.pkgMeta.version : undefined,
    wanted: uniqueOrNull(
      dependency.update.target,
      [dependency.pkgMeta && dependency.pkgMeta.version],
    ),
    latest: uniqueOrNull(
      dependency.update.latest,
      [dependency.pkgMeta && dependency.pkgMeta.version],
    ),
    unused: false,
  };
}

export function mapYarnDependencyToDependency(
  yarnDependency: Yarn.ResultDependency, unused: boolean,
)
  : Dependency.Entire {
  return {
    unused,
    name: yarnDependency[0],
    required: undefined,
    installed: yarnDependency[1],
    wanted: yarnDependency[2],
    latest: yarnDependency[3],
    type: undefined,
    repo: 'yarn',
  };
}

export function mapYarnResultTreeToBasic(
  yarnResults: Yarn.Result[],
): { [key: string]: Dependency.Basic } {
  const dependencies: { [key: string]: Dependency.Basic } = {};

  yarnResults
    .filter((r: any): r is Yarn.ResultTree => r.type === 'tree')
    .forEach((yarnTree) => {
      yarnTree.data.trees.forEach((yarnDependency) => {
        dependencies[yarnDependency.name.substr(0, yarnDependency.name.lastIndexOf('@'))] = {
          name: yarnDependency.name.substr(0, yarnDependency.name.lastIndexOf('@')),
          version: yarnDependency.name.substr(yarnDependency.name.lastIndexOf('@') + 1),
        };
      });
    });

  return dependencies;
}

export function mapYarnResultTableToVersion(
  yarnResults: Yarn.Result[],
): { [key: string]: Dependency.Version } {
  const dependencies: { [key: string]: Dependency.Version } = {};

  yarnResults
    .filter((r: any): r is Yarn.ResultTable => r.type === 'table')
    .forEach((yarnTable) => {
      yarnTable.data.body.forEach((yarnDependency) => {
        dependencies[yarnDependency[0]] = {
          wanted: yarnDependency[2],
          latest: yarnDependency[3],
        };
      });
    });

  return dependencies;
}
