export interface OutdatedBody {
  current: string;
  wanted: string;
  latest: string;
}

interface InstalledBodyBase {
  required: {
    version: string;
  };
  peerMissing: boolean;
}

interface InstalledBodyMissing {
  required: string;
  missing: boolean;
}

interface InstalledBodyExtra {
  version: string;
  extraneous?: boolean;
}

export type InstalledBody = InstalledBodyBase | InstalledBodyExtra | InstalledBodyMissing;

export type Outdated = Record<string, OutdatedBody>;

export interface Installed {
  dependencies?: Record<string, InstalledBody>;
}

interface InstallA {
  any: unknown;
}

interface InstallB {
  error: {
    summary: string;
  };
}

export type Install = InstallA | InstallB;
