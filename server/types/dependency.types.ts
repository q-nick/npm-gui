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
  [key: string]: unknown;
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

export interface BundleDetails {
  name: string;
  version: string;
  size: number;
  homepage: string;
  repository: string | undefined;
  updated: string;
  created: string;
  versions: string[];
  time: Record<string, string>;
}

export interface DependencyInstalled extends DependencyBase {
  installed?: string | null;
  wanted?: string | null;
  latest?: string | null;
}

export interface DependencyInstalledExtras
  extends DependencyInstalled,
    Partial<Omit<BundleDetails, 'name'>>,
    Partial<Omit<BundleScore, 'name'>> {}

export interface SearchResult {
  description: string;
  name: string;
  score: number;
  url: string;
  version: string;
}
