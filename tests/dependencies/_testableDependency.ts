interface Entire {
  repo: string;
  name: string;
  required: string;
  installed: string;
  type?: 'dev' | 'prod';
  wanted: string | null;
  latest: string | null;
  unused: boolean;
}

interface Dependency {
  name: string;
  version: string | null;
  entire: Entire;
}

export interface Test {
  repo: 'npm' | 'yarn' | 'bower';
  type: 'dev' | 'prod';
  repoDir: string;
  dependencies: Dependency[];
}

export const npmTest: Test = {
  repo: 'npm',
  repoDir: 'node_modules',
  type: 'prod',
  dependencies: [{
    name: 'npm-gui-tests',
    version: '1.0.0',
    entire: {
      repo: 'npm',
      name: 'npm-gui-tests',
      required: '^1.0.0',
      installed: '1.0.0',
      wanted: '1.1.1',
      latest: '2.1.1',
      unused: true,
    },
  }, {
    name: 'that-value',
    version: '0.1.1',
    entire: {
      repo: 'npm',
      name: 'that-value',
      required: '^0.1.1',
      installed: '0.1.1',
      wanted: '0.1.3',
      latest: null,
      unused: true,
    },
  }],
};

export const yarnTest: Test = {
  repo: 'npm',
  repoDir: 'node_modules',
  type: 'prod',
  dependencies: [{
    name: 'npm-gui-tests',
    version: '1.0.0',
    entire: {
      repo: 'yarn',
      name: 'npm-gui-tests',
      required: '1.0.0',
      installed: '1.0.0',
      wanted: null,
      latest: '2.1.1',
      unused: true,
    },
  }, {
    name: 'that-value',
    version: '0.1.1',
    entire: {
      repo: 'yarn',
      name: 'that-value',
      required: '0.1.1',
      installed: '0.1.1',
      wanted: null,
      latest: '0.1.3',
      unused: true,
    },
  }],
};

export const bowerTest: Test = {
  repo: 'bower',
  repoDir: 'bower_components',
  type: 'prod',
  dependencies: [{
    name: 'react',
    version: '15.5.0',
    entire: {
      repo: 'bower',
      name: 'react',
      required: '15.5.0',
      installed: '15.5.0',
      wanted: '15.5.0',
      latest: '16.1.0',
      unused: false,
    },
  }, {
    name: 'that-value',
    version: '0.1.1',
    entire: {
      repo: 'bower',
      name: 'that-value',
      required: '0.1.1',
      installed: '0.1.1',
      wanted: '0.1.1',
      latest: '0.1.3',
      unused: false,
    },
  }],
};

interface Project {
  pathEncoded: string;
  tests: Test[];
}

export const projectsNPM:Project[] = [{
  pathEncoded: 'dGVzdHMvcHJvamVjdHMvbnBt', // 'tests/projects/npm',
  tests: [
    { ...npmTest },
    { ...npmTest, type: 'dev' },
  ],
}];

export const projectsBower:Project[] = [{
  pathEncoded: 'dGVzdHMvcHJvamVjdHMvYm93ZXI=', // 'tests/projects/bower',
  tests: [
    { ...bowerTest },
    { ...bowerTest, type: 'dev' },
  ],
}];

export const projectsYarn:Project[] = [{
  pathEncoded: 'dGVzdHMvcHJvamVjdHMveWFybg==', // 'tests/projects/yarn',
  tests: [
    { ...yarnTest },
    { ...yarnTest, type: 'dev' },
  ],
}];

export const projects = [...projectsNPM, ...projectsBower, ...projectsYarn];
