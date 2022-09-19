import type { InstalledBody, OutdatedBody } from '../types/commands.types';
import type { DependencyInstalled, Npm } from '../types/dependency.types';

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
  required?: string,
): DependencyInstalled => {
  const installed =
    dependency.version !== undefined ? dependency.version : null;
  let wanted = version ? uniqueOrNull(version.wanted, [installed]) : null;
  const latest = version
    ? uniqueOrNull(version.latest, [installed, wanted])
    : null;

  if (installed === null && wanted === null && required !== undefined) {
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
