function uniqueOrNull(value, comparision) {
  return comparision.includes(value) ? null : value;
}

export function mapNpmDependency(name, dependency, version, required) {
  const installed = (dependency && dependency.version) || null;
  let wanted = version ? uniqueOrNull(version.wanted, [installed]) : null;
  const latest = version ? uniqueOrNull(version.latest, [installed, wanted]) : null;
  if (!installed && !wanted) {
    [wanted] = required.match(/\d.+/);
  }
  return {
    name,
    repo: 'npm',
    required,
    installed,
    wanted,
    latest,
  };
}

export function mapBowerDependency(name, dependency) {
  return {
    name,
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
