export type Type = 'dev' | 'extraneous' | 'global' | 'prod';
export type Repo = 'npm' | 'yarn';

export interface Basic {
  name: string;
  version?: string;
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

export interface Entire {
  name: string;
  type: Type;
  required?: string | null;
  installed?: string | null;
  wanted?: string | null;
  latest?: string | null;
  repo: Repo;
  unused?: boolean;
}

export interface SearchResult {
  description: string;
  name: string;
  score: number;
  url: string;
  version: string;
}
