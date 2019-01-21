import * as api from 'supertest';
import { expect } from 'chai';
import { app } from '../server';
import {
  npmGuiTestsPackageNPM,
  npmGuiTestsPackageBower,
  npmGuiTestsPackageYarn,
} from './npmGuiTestsPackage';

const testsNPM = [{
  projectPathEncoded: 'dGVzdC1wcm9qZWN0', // 'test-project',
  dependencies: [
    { ...npmGuiTestsPackageNPM },
    { ...npmGuiTestsPackageNPM, type: 'regular' },
  ],
}];

const testsBower = [{
  projectPathEncoded: 'dGVzdC1wcm9qZWN0', // 'test-project',
  dependencies: [
    { ...npmGuiTestsPackageBower, repo: 'bower' },
    { ...npmGuiTestsPackageBower, repo: 'bower', type: 'regular' },
  ],
}];

const testsYarn = [{
  projectPathEncoded: 'dGVzdC1wcm9qZWN0LXlhcm4=', // 'test-project-yarn',
  dependencies: [
    { ...npmGuiTestsPackageYarn },
    { ...npmGuiTestsPackageYarn, type: 'regular' },
  ],
}];

testsNPM;
testsBower;
testsYarn;

const tests = [...testsNPM, ...testsYarn]; // [...testsNPM, ...testsBower, ...testsYarn];

describe('packages', () => {
  tests.forEach((test) => {
    test.dependencies.forEach((dependency) => {
      const dependencyToTest = {
        ...dependency.entire,
        type: dependency.type,
      };

      const pathNameDecoded = Buffer.from(test.projectPathEncoded, 'base64');
      describe(`installing ${dependency.name}@${dependency.version} as ${dependency.type} with ${dependency.repo} to ${pathNameDecoded}`, () => { // tslint:disable:max-line-length
        it('should install new package', (done) => {
          api(app)
            .post(`/api/project/${test.projectPathEncoded}/dependencies/${dependency.type}/${dependency.repo}`)
            .send([dependency])
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.equal({ ...dependencyToTest });
              done();
            });
        }).timeout(10000);

        it('should return all packages (and new one)', (done) => {
          api(app)
            .get(`/api/project/${test.projectPathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.include({ ...dependencyToTest });
              done();
            });
        }).timeout(10000);
      });

      describe(`uninstalling ${dependency.name} as ${dependency.type} with ${dependency.repo} from ${pathNameDecoded}`, () => { // tslint:disable:max-line-length
        it('should remove previously installed package', (done) => {
          api(app)
            .delete(`/api/project/${test.projectPathEncoded}/dependencies/${dependency.type}/${dependency.repo}/${dependency.name}`) // tslint:disable:max-line-length
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.equal({});
              done();
            });
        }).timeout(10000);

        it('should return all packages (without new one)', (done) => {
          api(app)
            .get(`/api/project/${test.projectPathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.not.include({ ...dependencyToTest, repo: 'yarn' });
              done();
            });
        }).timeout(10000);
      });

      // TODO install as newest
    });
  });
});
