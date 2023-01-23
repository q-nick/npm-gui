export interface OutdatedBody {
  current: string;
  wanted: string;
  latest: string;
}

// eslint-disable-next-line @typescript-eslint/no-type-alias
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
  problems: string[];
}

interface InstalledBodyInvalidOverriden {
  overriden: boolean;
}

export type InstalledBody =
  | InstalledBodyBase
  | InstalledBodyExtra
  | InstalledBodyInvalid
  | InstalledBodyInvalidOverriden
  | InstalledBodyMissing;

export interface Installed {
  dependencies?: Record<string, InstalledBody>;
}

export interface Details {
  repository?: {
    type: string;
    url: string;
    directory: string;
  };
  homepage: string;
  versions: string[];
  time: {
    [key: string]: string;
    modified: string;
    created: string;
  };
  dist: {
    unpackedSize: string;
  };
}
