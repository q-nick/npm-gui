/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from 'chai';
import {
  getFull, getSimple, prepareTestProject, TEST_PKG, TEST_PKG_INSTALLED, TEST_PKG_UNINSTALLED,
} from './tests-utils';

describe('simple', () => {
  it('nothing', async () => {
    await prepareTestProject();

    expect((await getSimple()).body).deep.equal([]);
    expect((await getFull()).body).deep.equal([]);
  });

  it('uninstalled', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' });

    expect((await getSimple()).body).deep.equal([TEST_PKG]);
    expect((await getFull()).body).deep.equal([TEST_PKG_UNINSTALLED]);
  });

  it('installed', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' }, undefined, 'npm');

    expect((await getSimple()).body).deep.equal([TEST_PKG]);
    expect((await getFull()).body).deep.equal([TEST_PKG_INSTALLED]);
  });
});
