module.exports = {
  bower: {
    install: {
      command: 'bower',
      args: ['install'],
    },
    remove: {
      command: 'bower',
      args: ['uninstall'],
    },
    ls: {
      command: 'bower',
      args: ['ls', '--depth=0', '--json'],
    },
    prune: {
      command: 'bower',
      args: ['prune'],
    },
    update: {
      command: 'bower',
      args: ['update'],
    },
  },
  nsp: {
    check: {
      command: `${global.appRoot}/node_modules/nsp/bin/nsp`,
      args: ['check', '--output', 'json'],
    },
  },
  npm: {
    ls: {
      command: 'npm',
      args: ['ls', '--depth=0', '--json'],
    },
    outdated: {
      command: 'npm',
      args: ['outdated', '--json'],
    },
    install: {
      command: 'npm',
      args: ['install'],
    },
    remove: {
      command: 'npm',
      args: ['uninstall'],
    },
    run: {
      command: 'npm',
      args: ['run'],
    },
    bin: {
      command: 'npm',
      args: ['bin'],
    },
    prune: {
      command: 'npm',
      args: ['prune'],
    },
    dedupe: {
      command: 'npm',
      args: ['dedupe'],
    },
    update: {
      command: 'npm',
      args: ['update'],
    },
    shrinkwrap: {
      command: 'npm',
      args: ['shrinkwrap'],
    },
  },
};
