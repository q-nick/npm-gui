import * as api from 'supertest';
import { expect } from 'chai';
import { app } from '../../server';
import { projects } from './_testableDependency';

describe('single dependency operations', () => {
  projects.forEach((project) => {
    project.tests.forEach((test) => {
      const dependenciesToTest =
        test.dependencies.map(
          dependency => ({ ...dependency, entire: { ...dependency.entire, type: test.type } }));
      const dependency = {
        name: dependenciesToTest[0].name,
        version: dependenciesToTest[0].version,
      };
      const dependencyToTest = dependenciesToTest[0].entire;

      const pathNameDecoded = Buffer.from(project.pathEncoded, 'base64');
      describe(`installing ${dependency.name}@${dependency.version} as ${test.type} with ${test.repo} to ${pathNameDecoded}`, () => { // tslint:disable:max-line-length
        it('should install new dependency', (done) => {
          api(app)
            .post(`/api/project/${project.pathEncoded}/dependencies/${test.type}/${test.repo}`)
            .send([dependency])
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              done();
            });
        });

        it('should return all dependencies (and new one)', (done) => {
          api(app)
            .get(`/api/project/${project.pathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.include({ ...dependencyToTest });
              done();
            });
        });
      });

      describe(`uninstalling ${dependency.name} as ${test.type} with ${test.repo} from ${pathNameDecoded}`, () => { // tslint:disable:max-line-length
        it('should remove previously installed test', (done) => {
          api(app)
            .delete(`/api/project/${project.pathEncoded}/dependencies/${test.type}/${test.repo}/${dependency.name}`) // tslint:disable:max-line-length
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.equal({});
              done();
            });
        });

        it('should return all dependencies (without new one)', (done) => {
          api(app)
            .get(`/api/project/${project.pathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.not.include({ ...dependencyToTest });
              done();
            });
        });
      });
    });
  });
});
