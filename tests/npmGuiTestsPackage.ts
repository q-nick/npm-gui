export const npmGuiTestsPackageNPM:any = {
  name: 'npm-gui-tests',
  repo: 'npm',
  type: 'dev',
  version: '1.0.0',
  entire: {
    repo: 'npm',
    name: 'npm-gui-tests',
    required: '^1.0.0',
    installed: '1.0.0',
    wanted: '1.1.1',
    latest: '2.1.1',
  },
};

export const npmGuiTestsPackageYarn:any = {
  name: 'npm-gui-tests',
  repo: 'npm',
  type: 'dev',
  version: '1.0.0',
  entire: {
    repo: 'yarn',
    name: 'npm-gui-tests',
    required: '1.0.0', // TODO ^1.0.0
    installed: '1.0.0',
    wanted: null,
    latest: '2.1.1',
  },
};

export const npmGuiTestsPackageBower:any = {
  name: 'react',
  repo: 'bower',
  type: 'dev',
  version: '15.5.0',
  entire: {
    repo: 'bower',
    name: 'react',
    required: '15.5.0',
    installed: '15.5.0',
    wanted: null,
    latest: '16.1.0',
  },
};
