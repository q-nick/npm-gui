declare namespace Dependency {
  type Type = 'dev' | 'prod' | 'global' | 'extraneous';
  type Repo = 'npm' | 'yarn';

  interface Basic {
    name: string;
    version?: string;
  }

  interface Npm {
    name: string,
    type: Type,
    version?: string,
    required?: string,
  }

  interface Version {
    wanted: string;
    latest: string;
  }

  interface Entire {
    name: string,
    type: Type,
    required?: string | null,
    installed?: string | null,
    wanted?: string | null,
    latest?: string | null,
    repo: Repo;
    unused?: boolean,
  }

  interface SearchResult {
    description: string,
    name: string,
    score: number,
    url: string,
    version: string,
  }
}
