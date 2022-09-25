export interface OutdatedBody {
  current: string;
  wanted: string;
  latest: string;
}

export type Outdated = Record<string, OutdatedBody>;

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

interface InstalledBodyInvalid {
  invalid: string;
  prbolems: string[];
}

export type InstalledBody =
  | InstalledBodyBase
  | InstalledBodyExtra
  | InstalledBodyInvalid
  | InstalledBodyMissing;

export interface Installed {
  dependencies?: Record<string, InstalledBody>;
}
