'use strict';

var npm = {
    ls: {
        command: 'npm',
        args: ['ls', '--depth=0', '--json'],
    },
    outdated: {
        command: 'npm',
        args: ['outdated', '--json']
    },
    install: {
        command: 'npm',
        args: ['install']
    },
    uninstall: {
        command: 'npm',
        args: ['uninstall']
    },
    run: {
        command: 'npm',
        args: ['run']
    },
    bin: {
        command: 'npm',
        args: ['bin']
    },
    prune: {
        command: 'npm',
        args: ['prune']
    },
    dedupe: {
        command: 'npm',
        args: ['dedupe']
    },
    update: {
        command: 'npm',
        args: ['update']
    },
    shrinkwrap: {
        command: 'npm',
        args: ['shrinkwrap']
    }
};

var nsp = {
    check: {
        command: appRoot + '/node_modules/nsp/bin/nsp',
        args: ['check', '--output', 'json']
    }
};

var bower = {
    install: {
        command: 'bower',
        args: ['install']
    },
    uninstall: {
        command: 'bower',
        args: ['uninstall']
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
}

module.exports.npm = npm;
module.exports.nsp = nsp;
module.exports.bower = bower;
