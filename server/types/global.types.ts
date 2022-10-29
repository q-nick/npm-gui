/* eslint-disable @typescript-eslint/no-type-alias */

export type SearchResponse = {
  name: string;
  version: string;
  score: number;
  updated: string;
  repository?: string;
  homepage?: string;
  npm?: string;
  description: string;
}[];

export interface ExplorerRequest {
  path?: string;
}

export interface FileOrFolder {
  name: string;
  isDirectory: boolean;
  isProject: boolean;
}

export interface ExplorerResponse {
  ls: FileOrFolder[];
  path: string;
  changed: boolean;
}

export interface AvailableManagerResponse {
  npm: boolean;
  yarn: boolean;
  pnpm: boolean;
}
