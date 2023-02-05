/* eslint-disable @typescript-eslint/no-type-alias */
export interface OutdatedBodyPNPM {
  current: string;
  wanted: string;
  latest: string;
}

export type OutdatedPNPM = string;

interface InstalledBodyBase {
  version: string;
}

// interface InstalledBodyMissing {
//   required: string;
//   missing: boolean;
// }

// interface InstalledBodyExtra {
//   version: string;
//   extraneous?: boolean;
// }

// eslint-disable-next-line line-comment-position, no-inline-comments
export type InstalledBodyPNPM = InstalledBodyBase; // | InstalledBodyExtra | InstalledBodyMissing;

export type InstalledPNPM = [
  {
    devDependencies?: Record<string, InstalledBodyPNPM>;
    dependencies?: Record<string, InstalledBodyPNPM>;
  },
];
