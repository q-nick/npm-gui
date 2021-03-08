import { expect } from 'chai';
import { HTTP_STATUS_OK } from '../server/utils/utils';
import {
  add,
  getFull,
  getSimple,
  prepareTestProject,
  TEST,
  nextManager,
} from './tests-utils';

nextManager((manager) => {
  describe(`${manager} add dependency`, () => {
    it('invalid name', async () => {
      await prepareTestProject(manager);

      const response = await add('prod', [{ name: 'sdmvladbf3', version: 'v1.0.0' }]);
      expect(response.status).not.to.equal(HTTP_STATUS_OK);

      expect((await getSimple()).body).deep.equal([]);
      expect((await getFull()).body).deep.equal([]);
    });

    it('invalid version', async () => {
      await prepareTestProject(manager);

      const response = await add('prod', [{ name: 'npm-gui-tests', version: 'v3.0.0' }]);
      expect(response.status).not.to.equal(HTTP_STATUS_OK);

      expect((await getSimple()).body).deep.equal([]);
      expect((await getFull()).body).deep.equal([]);
    });

    it('correct dependency, no version', async () => {
      await prepareTestProject(manager);

      const response = await add('prod', [{ name: 'npm-gui-tests' }]);
      expect(response.status).to.equal(HTTP_STATUS_OK);

      expect((await getSimple()).body).deep.equal([{ ...TEST[manager].PKG2, required: '^2.1.1' }]);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG2_NEWEST]);
    });

    it('correct dependency, with version', async () => {
      await prepareTestProject(manager);

      const response = await add('prod', [{ name: 'npm-gui-tests', version: '^1.0.0' }]);
      expect(response.status).to.equal(HTTP_STATUS_OK);

      expect((await getSimple()).body).deep.equal([TEST[manager].PKG2]);
      expect((await getFull()).body).deep.equal([TEST[manager].PKG2_INSTALLED]);
    });
  });
});
