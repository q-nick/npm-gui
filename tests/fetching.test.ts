import { expect } from 'chai';
import {
  getFull,
  getSimple,
  nextManager,
  prepareTestProject,
  TEST,
} from './tests-utils';

nextManager((manager) => {
  describe(`${manager} fetching`, () => {
    it('nothing', async () => {
      await prepareTestProject(manager);

      expect((await getSimple()).body).deep.equal([]);
      expect((await getFull()).body).deep.equal([]);
    });

    it('uninstalled', async () => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' });
      console.log((await getSimple()).body);
      expect((await getSimple()).body).deep.equal([TEST[manager].PKG]);
      console.log((await getFull()).body);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG_UNINSTALLED]);
    });

    it('installed', async () => {
      await prepareTestProject(manager, { 'npm-gui-tests': '^1.0.0' }, undefined, true);

      expect((await getSimple()).body).deep.equal([TEST[manager].PKG]);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG_INSTALLED]);
    });
  });
});
