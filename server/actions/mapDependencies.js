function uniqueOrNull(verA, verB) {
  return verA !== verB ? verA : null;
}

export function mapNpmDependency(name, dependency, version, requiredVersion) {
  return {
    name,
    repo: 'npm',
    required: requiredVersion,
    installed: dependency.version,
    wanted: version && uniqueOrNull(version.wanted, dependency.version),
    latest: version && uniqueOrNull(version.latest, dependency.version),
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
      dependency.pkgMeta && dependency.pkgMeta.version,
    ),
    latest: uniqueOrNull(
      dependency.update.latest,
      dependency.pkgMeta && dependency.pkgMeta.version,
    ),
  };
}
