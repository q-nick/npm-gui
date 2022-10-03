export type Type = 'dev' | 'extraneous' | 'global' | 'prod';
export type Manager = 'npm' | 'pnpm' | 'yarn';

export interface Basic {
  name: string;
  version?: string;
  type?: Type;
}

export interface Npm {
  name: string;
  type: Type;
  version?: string;
  required?: string;
}

export interface Version {
  wanted: string;
  latest: string;
}

export interface DependencyBase {
  name: string;
  type: Type;
  manager: Manager;
  required?: string;
}

export interface BundleScore {
  score: number | null;
  name: string;
}

export interface BundleSize {
  size: number;
  version: string;
  gzip: number;
  name: string;
  repository: string;
}

// export interface Entire
//   extends DependencyBase,
//     Partial<Omit<BundleSize, 'name'>>,
//     Partial<Omit<BundleScore, 'name'>> {
//   installed?: string | null;
//   wanted?: string | null;
//   latest?: string | null;
// }

export interface DependencyInstalled extends DependencyBase {
  installed?: string | null;
  wanted?: string | null;
  latest?: string | null;
}

export interface DependencyInstalledExtras
  extends DependencyInstalled,
    Partial<Omit<BundleSize, 'name'>>,
    Partial<Omit<BundleScore, 'name'>> {}

export interface SearchResult {
  description: string;
  name: string;
  score: number;
  url: string;
  version: string;
}
