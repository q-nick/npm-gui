/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from 'chai';
import {
  getFull, getSimple, install, prepareTestProject, TEST_PKG,
} from './tests-utils';

describe('install', () => {
  it('nothing', async () => {
    await prepareTestProject();

    await install();

    expect((await getSimple()).body).deep.equal([]);
    expect((await getFull()).body).deep.equal([]);
  });

  it('uninstalled', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' });

    await install();

    expect((await getSimple()).body).deep.equal([TEST_PKG]);

    expect((await getFull()).body).deep.equal([
      {
        ...TEST_PKG,
        installed: '1.1.1',
        wanted: null,
        latest: '2.1.1',
      },
    ]);
  });

  it('installed', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' }, undefined, 'npm');

    await install();

    expect((await getSimple()).body).deep.equal([TEST_PKG]);

    expect((await getFull()).body).deep.equal([
      {
        ...TEST_PKG,
        installed: '1.1.1',
        wanted: null,
        latest: '2.1.1',
      },
    ]);
  });
});
