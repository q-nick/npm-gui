/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from 'chai';
import { HTTP_STATUS_OK } from '../server/utils/utils';
import {
  del,
  getFull,
  getSimple,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager((manager) => {
  describe(`${manager} delete dependency`, () => {
    it('uninstalled invalid name', async () => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      const response = await del('prod', 'sdmvladbf3');
      expect(response.status).to.equal(HTTP_STATUS_OK);
      await del('prod', 'sdmvladbf3'); // we skip checking response status - it behaves different for npm and yarn

      expect((await getSimple()).body).deep.equal([TEST[manager].PKG]);
    });

    it('uninstalled valid name', async () => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      const response = await del('prod', 'npm-gui-tests');
      expect(response.status).to.equal(HTTP_STATUS_OK);

      expect((await getSimple()).body).deep.equal([]);
      expect((await getFull()).body).deep.equal([]);
    });

    it('installed valid name', async () => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' }, undefined, true);

      expect((await getSimple()).body).deep.equal([TEST[manager].PKG]);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG_INSTALLED]);

      const response = await del('prod', 'npm-gui-tests');
      expect(response.status).to.equal(HTTP_STATUS_OK);

      expect((await getSimple()).body).deep.equal([]);
      expect((await getFull()).body).deep.equal([]);
    });
  });
});
