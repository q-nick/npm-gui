export interface OutdatedBody {
  current: string;
  wanted: string;
  latest: string;
}

interface InstalledBodyA {
  required: {
    version: string;
  };
  peerMissing: boolean;
}

interface InstalledBodyB {
  required: string;
  missing: boolean;
}

interface InstalledBodyC {
  version: string;
  extraneous?: boolean;
}

export type InstalledBody = InstalledBodyA | InstalledBodyB | InstalledBodyC;

export type Outdated = Record<string, OutdatedBody>;

export interface Installed {
  dependencies: Record<string, InstalledBody>;
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
