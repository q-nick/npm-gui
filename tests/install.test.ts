/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from 'chai';

import {
  getFull,
  getSimple,
  install,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager((manager) => {
  describe(`${manager} install`, () => {
    it('nothing', async () => {
      await prepareTestProject(manager);

      await install();

      expect((await getSimple()).body).deep.equal([]);
      expect((await getFull()).body).deep.equal([]);
    });

    it('uninstalled', async () => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });

      await install();

      expect((await getSimple()).body).deep.equal([TEST[manager].PKG]);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG_INSTALLED]);
    });

    it('installed', async () => {
      await prepareTestProject(
        manager,
        { 'npm-gui-tests': '^1.0.0' },
        undefined,
        true,
      );

      await install();

      expect((await getSimple()).body).deep.equal([TEST[manager].PKG]);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG_INSTALLED]);
    });
  });
});
