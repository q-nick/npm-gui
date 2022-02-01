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

export type InstalledBodyPNPM = InstalledBodyBase; // | InstalledBodyExtra | InstalledBodyMissing;

export type InstalledPNPM = [
  {
    devDependencies?: Record<string, InstalledBody>;
    dependencies?: Record<string, InstalledBody>;
  },
];
