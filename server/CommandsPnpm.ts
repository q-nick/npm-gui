export interface OutdatedBody {
  current: string;
  wanted: string;
  latest: string;
}

export type Outdated = string;

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

export type InstalledBody = InstalledBodyBase; // | InstalledBodyExtra | InstalledBodyMissing;

export type Installed = [
  {
    devDependencies?: Record<string, InstalledBody>;
    dependencies?: Record<string, InstalledBody>;
  },
];
