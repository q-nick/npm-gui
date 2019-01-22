interface Entire {
  repo: string;
  name: string;
  required: string;
  installed: string;
  type?: 'dev' | 'regular';
  wanted: string;
  latest: string;
}

interface Dependency {
  name: string;
  version: string;
  entire: Entire;
}

export interface Test {
  repo: 'npm' | 'yarn' | 'bower';
  type: 'dev' | 'regular';
  dependencies: Dependency[];
}

export const npmDependencies: Test = {
  repo: 'npm',
  type: 'regular',
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
    },
  }, {
    name: 'has-yarn', // TODO second package to test
    version: '1.0.0',
    entire: {
      repo: 'npm',
      name: 'has-yarn',
      required: '^1.0.0',
      installed: '1.0.0',
      wanted: null,
      latest: null,
    },
  }],
};

export const yarnDependencies: Test = {
  repo: 'npm',
  type: 'regular',
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
    },
  }, {
    name: 'has-yarn', // TODO second package to test
    version: '1.0.0',
    entire: {
      repo: 'yarn',
      name: 'has-yarn',
      required: '1.0.0',
      installed: '1.0.0',
      wanted: null,
      latest: null,
    },
  }],
};

export const bowerDependencies: Test = {
  repo: 'bower',
  type: 'regular',
  dependencies: [{
    name: 'react',
    version: '15.5.0',
    entire: {
      repo: 'bower',
      name: 'react',
      required: '15.5.0',
      installed: '15.5.0',
      wanted: null,
      latest: '16.1.0',
    },
  }, {
    name: 'that-value',
    version: '0.1.1',
    entire:{
      repo: 'bower',
      name: 'that-value',
      required: '0.1.1',
      installed: '0.1.1',
      wanted: null,
      latest: '0.1.3',
    },
  }],
};
