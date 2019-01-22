import * as api from 'supertest';
import { expect } from 'chai';
import { app } from '../server';
import {
  npmGuiTestsPackageNPM,
  npmGuiTestsPackageBower,
  npmGuiTestsPackageYarn,
} from './npmGuiTestsPackage';

const testsNPM = [{
  projectPathEncoded: 'dGVzdHMvcHJvamVjdHMvbnBt', // 'tests/projects/npm',
  dependencies: [
    { ...npmGuiTestsPackageNPM },
    { ...npmGuiTestsPackageNPM, type: 'regular' },
  ],
}];

const testsBower = [{
  projectPathEncoded: 'dGVzdHMvcHJvamVjdHMvYm93ZXI=', // 'tests/projects/bower',
  dependencies: [
    // { ...npmGuiTestsPackageBower },
    { ...npmGuiTestsPackageBower, type: 'regular' },
  ],
}];

const testsYarn = [{
  projectPathEncoded: 'dGVzdHMvcHJvamVjdHMveWFybg==', // 'tests/projects/yarn',
  dependencies: [
    { ...npmGuiTestsPackageYarn },
    { ...npmGuiTestsPackageYarn, type: 'regular' },
  ],
}];

testsNPM;
testsBower;
testsYarn;

const tests = [...testsNPM, ...testsBower, ...testsYarn];

describe('single dependency operations', () => {
  tests.forEach((test) => {
    test.dependencies.forEach((dependency) => {
      const dependencyToTest = {
        ...dependency.entire,
        type: dependency.type,
      };

      const pathNameDecoded = Buffer.from(test.projectPathEncoded, 'base64');
      describe(`installing ${dependency.name}@${dependency.version} as ${dependency.type} with ${dependency.repo} to ${pathNameDecoded}`, () => { // tslint:disable:max-line-length
        it('should install new dependency', (done) => {
          api(app)
            .post(`/api/project/${test.projectPathEncoded}/dependencies/${dependency.type}/${dependency.repo}`)
            .send([dependency])
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              done();
            });
        }).timeout(20000);

        it('should return all dependencies (and new one)', (done) => {
          api(app)
            .get(`/api/project/${test.projectPathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.include({ ...dependencyToTest });
              done();
            });
        }).timeout(20000);
      });

      describe(`uninstalling ${dependency.name} as ${dependency.type} with ${dependency.repo} from ${pathNameDecoded}`, () => { // tslint:disable:max-line-length
        it('should remove previously installed dependency', (done) => {
          api(app)
            .delete(`/api/project/${test.projectPathEncoded}/dependencies/${dependency.type}/${dependency.repo}/${dependency.name}`) // tslint:disable:max-line-length
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.equal({});
              done();
            });
        }).timeout(20000);

        it('should return all dependencies (without new one)', (done) => {
          api(app)
            .get(`/api/project/${test.projectPathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.not.include({ ...dependencyToTest });
              done();
            });
        }).timeout(20000);
      });

      // TODO install as newest
    });
  });
});
