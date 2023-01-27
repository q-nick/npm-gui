[![Downloads](https://img.shields.io/npm/dm/npm-gui?style=for-the-badge)](https://www.npmjs.com/package/npm-gui)
&nbsp;
[![MIT License](https://img.shields.io/npm/l/npm-gui?style=for-the-badge)](https://choosealicense.com/licenses/mit/)
&nbsp;
[![Github](https://img.shields.io/github/stars/q-nick/npm-gui?style=for-the-badge)](https://github.com/q-nick/npm-gui)
&nbsp;
[![npm](https://img.shields.io/npm/v/npm-gui?style=for-the-badge)](https://www.npmjs.com/package/npm-gui)

![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/q-nick/npm-gui/build.yml?style=for-the-badge)
&nbsp;
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/q-nick/npm-gui/windows.yml?label=windows%20test&style=for-the-badge)
&nbsp;
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/q-nick/npm-gui/macos.yml?label=macos%20test&style=for-the-badge)
&nbsp;
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/q-nick/npm-gui/linux.yml?label=linux%20test&style=for-the-badge)

# npm-gui

Homepage and full documentation: https://npm-gui.nullapps.dev

`npm-gui` is a convenient tool for managing javascript project dependencies listed in `package.json`. Under the hood, it will transparently use `npm`, `pnpm`, or `yarn` commands to install, remove or update dependencies
(_to use **yarn** it requires the **yarn.lock** file to be present in the project folder._)

![App Demo](https://npm-gui.nullapps.dev/batch-install.GIF)

## Getting Started

The recommended way to run `npm-gui` is by using <a href="https://www.npmjs.com/package/npx">`npx`</a>:

```
~/$ npx npm-gui@latest
```

It will run the most recent version of `npm-gui` without installing it on your system.

#### Installation as global dependency

`npm-gui` could also be installed as a global dependency:

```
~/$ npm install -g npm-gui
```

and then run with just:

```
~/$ npm-gui
```

#### Installation as local dependency (not-recommended)

```
~/$ npm install npm-gui
```

To read more visit: https://npm-gui.nullapps.dev/docs/npm-gui/

## Authors

- [@q-nick](https://www.github.com/q-nick)

## Documentation

[Documentation](https://npm-gui.nullapps.dev/docs/npm-gui/)

## Next features on roadmap

- npm-gui integrated into VS Code as an extension

- other package managers like: _poetry_, _composer_, _nuget_

- packages updates history

- re-arrange existing columns

- expandable/collapsable module to reveal it's dependency tree _(npm-remote-ls)_

- number of dependencies per module

- move dependency between dev and prod

- visual indicator if the package seems to be unuse _(depcheck)_

- hint like: "shouldn't this be a dev-dependency?"
