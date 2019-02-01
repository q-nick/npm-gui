declare namespace Dependency {
  type Type = 'dev' | 'prod' | 'global' | 'extraneous';
  type Repo = 'bower' | 'npm' | 'yarn';

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

  interface Bower {
    version: string,
    endpoint: {
      target: string,
      name: string,
    },
    pkgMeta: {
      version: string;
    },
    update: {
      target: string;
      latest: string;
    },
    type?: Type;
  }

  interface Version {
    wanted: string;
    latest: string;
  }

  interface Entire {
    name: string,
    type: Type,
    required?: string,
    installed?: string,
    wanted?: string,
    latest?: string,
    repo: Repo;
  }
}
