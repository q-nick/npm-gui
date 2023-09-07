/* eslint-disable no-console */
/* eslint-disable unicorn/catch-error-name */
/* eslint-disable unicorn/prefer-optional-catch-binding */
/* eslint-disable eqeqeq */
/* eslint-disable no-eq-null */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable init-declarations */
/* eslint-disable unicorn/prefer-spread */
/* eslint-disable unicorn/better-regex */
/* eslint-disable no-undef */
/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
/* eslint-disable no-param-reassign */
/* eslint-disable func-style */
const path = require('path');
const which = require('which');
const getPathKey = require('path-key');
const fs = require('fs');
const shebangCommand = require('shebang-command');

const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;

function escapeCommand(arg) {
  // Escape meta chars
  arg = arg.replace(metaCharsRegExp, '^$1');

  return arg;
}

function escapeArgument(arg, doubleEscapeMetaChars) {
  // Convert to string
  arg = `${arg}`;

  // Algorithm below is based on https://qntm.org/cmd

  // Sequence of backslashes followed by a double quote:
  // double up all the backslashes and escape the double quote
  arg = arg.replace(/(\\*)"/g, '$1$1\\"');

  // Sequence of backslashes followed by the end of the string
  // (which will become a double quote later):
  // double up all the backslashes
  arg = arg.replace(/(\\*)$/, '$1$1');

  // All other backslashes occur literally

  // Quote the whole thing:
  arg = `"${arg}"`;

  // Escape meta chars
  arg = arg.replace(metaCharsRegExp, '^$1');

  // Double escape meta chars if necessary
  if (doubleEscapeMetaChars) {
    arg = arg.replace(metaCharsRegExp, '^$1');
  }

  return arg;
}

const escape = {
  command: escapeCommand,
  argument: escapeArgument,
};

function readShebang(command) {
  // Read the first 150 bytes from the file
  const size = 150;
  const buffer = Buffer.alloc(size);

  let fd;

  try {
    fd = fs.openSync(command, 'r');
    fs.readSync(fd, buffer, 0, size, 0);
    fs.closeSync(fd);
  } catch (e) {
    /* Empty */
  }

  // Attempt to extract shebang (null is returned if not a shebang)
  return shebangCommand(buffer.toString());
}

function resolveCommandAttempt(parsed, withoutPathExt) {
  const env = parsed.options.env || process.env;
  const cwd = process.cwd();
  const hasCustomCwd = parsed.options.cwd != null;
  // Worker threads do not have process.chdir()
  const shouldSwitchCwd =
    hasCustomCwd && process.chdir !== undefined && !process.chdir.disabled;

  // If a custom `cwd` was specified, we need to change the process cwd
  // because `which` will do stat calls but does not support a custom cwd
  if (shouldSwitchCwd) {
    try {
      process.chdir(parsed.options.cwd);
    } catch (err) {
      /* Empty */
    }
  }

  let resolved;

  try {
    resolved = which.sync(parsed.command, {
      path: env[getPathKey({ env })],
      pathExt: withoutPathExt ? path.delimiter : undefined,
    });
  } catch (e) {
    /* Empty */
  } finally {
    if (shouldSwitchCwd) {
      process.chdir(cwd);
    }
  }

  // If we successfully resolved, ensure that an absolute path is returned
  // Note that when a custom `cwd` was used, we need to resolve to an absolute path based on it
  if (resolved) {
    resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : '', resolved);
  }

  return resolved;
}

function resolveCommand(parsed) {
  return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
}

const isWin = process.platform === 'win32';
const isExecutableRegExp = /\.(?:com|exe)$/i;
const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;

function detectShebang(parsed) {
  parsed.file = resolveCommand(parsed);

  const shebang = parsed.file && readShebang(parsed.file);

  if (shebang) {
    parsed.args.unshift(parsed.file);
    parsed.command = shebang;

    return resolveCommand(parsed);
  }

  return parsed.file;
}

function parseNonShell(parsed) {
  if (!isWin) {
    return parsed;
  }

  // Detect & add support for shebangs
  const commandFile = detectShebang(parsed);

  // We don't need a shell if the command filename is an executable
  const needsShell = !isExecutableRegExp.test(commandFile);

  // If a shell is required, use cmd.exe and take care of escaping everything correctly
  // Note that `forceShell` is an hidden option used only in tests
  if (parsed.options.forceShell || needsShell) {
    // Need to double escape meta chars if the command is a cmd-shim located in `node_modules/.bin/`
    // The cmd-shim simply calls execute the package bin file with NodeJS, proxying any argument
    // Because the escape of metachars with ^ gets interpreted when the cmd.exe is first called,
    // we need to double escape them
    const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);

    // Normalize posix paths into OS compatible paths (e.g.: foo/bar -> foo\bar)
    // This is necessary otherwise it will always fail with ENOENT in those cases
    parsed.command = path.normalize(parsed.command);

    // Escape command & arguments
    parsed.command = escape.command(parsed.command);
    parsed.args = parsed.args.map((argument) =>
      escape.argument(argument, needsDoubleEscapeMetaChars),
    );

    const shellCommand = [parsed.command].concat(parsed.args).join(' ');

    parsed.args = ['/d', '/s', '/c', `"${shellCommand}"`];
    parsed.command = process.env.comspec || 'cmd.exe';
    parsed.options.windowsVerbatimArguments = true; // Tell node's spawn that the arguments are already escaped
  }

  return parsed;
}

function parse(command, arguments_, options) {
  // Normalize arguments, similar to nodejs
  if (arguments_ && !Array.isArray(arguments_)) {
    options = arguments_;
    arguments_ = null;
  }

  arguments_ = arguments_ ? [...arguments_] : []; // Clone array to avoid changing the original
  options = { ...options }; // Clone object to avoid changing the original

  // Build our parsed object
  const parsed = {
    command,
    args: arguments_,
    options,
    file: undefined,
    original: {
      command,
      args: arguments_,
    },
  };

  // Delegate further parsing to shell or non-shell
  return options.shell ? parsed : parseNonShell(parsed);
}

const parsed = parse(
  'npm',
  ['install', 'npm-gui-tests@^1.0.0', '-P', '--json'],
  {},
);

console.log(parsed);
