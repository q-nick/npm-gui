/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from 'chai';
import { HTTP_STATUS_OK } from '../server/utils/utils';
import {
  del,
  getFull, getSimple, prepareTestProject, TEST_PKG, TEST_PKG_INSTALLED,
} from './tests-utils';

describe('delete dependency', () => {
  it('uninstalled invalid name', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' });

    const response = await del('prod', 'sdmvladbf3');
    expect(response.status).to.equal(HTTP_STATUS_OK);

    expect((await getSimple()).body).deep.equal([TEST_PKG]);
    expect((await getFull()).body).deep.equal([TEST_PKG_INSTALLED]);
  });

  it.only('uninstalled valid name', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' });

    const response = await del('prod', 'npm-gui-tests');
    expect(response.status).to.equal(HTTP_STATUS_OK);

    expect((await getSimple()).body).deep.equal([]);
    expect((await getFull()).body).deep.equal([]);
  });

  it.only('installed valid name', async () => {
    await prepareTestProject({ 'npm-gui-tests': '^1.0.0' }, undefined, 'npm');

    expect((await getSimple()).body).deep.equal([TEST_PKG]);
    expect((await getFull()).body).deep.equal([TEST_PKG_INSTALLED]);

    const response = await del('prod', 'npm-gui-tests');
    expect(response.status).to.equal(HTTP_STATUS_OK);

    expect((await getSimple()).body).deep.equal([]);
    expect((await getFull()).body).deep.equal([]);
  });
});
