import type { InstalledBody } from '../types/commands.types';

export const uniqueOrNull = (
  value: string | undefined,
  comparision: (string | null | undefined)[],
): string | null => {
  if (value === undefined) {
    return null;
  }

  return comparision.includes(value) ? null : value;
};

// eslint-disable-next-line max-statements
export const getInstalledVersion = (
  installed?: InstalledBody,
): string | null => {
  if (!installed) {
    return null;
  }

  if ('version' in installed) {
    return installed.version;
  }

  if ('invalid' in installed) {
    return null;
  }

  if ('missing' in installed) {
    return null;
  }

  if ('extraneous' in installed) {
    return null;
  }

  if (!('required' in installed)) {
    return null;
  }

  if (typeof installed.required === 'string') {
    return null;
  }

  // TODO peerMissing ERROR HERE
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
