import api from 'supertest';
import { expect } from 'chai';
import { app } from '../../server';
import { projects } from './_testableDependency';

describe('multiple dependencies operations', () => {
  projects.forEach((project) => {
    project.tests.forEach((test) => {
      let dependenciesToTest:any[] = [];
      if (test.repo === 'bower') {
        dependenciesToTest = test.dependencies.map(
          (dependency) => ({
            ...dependency,
            entire:
              { ...dependency.entire, type: test.type, wanted: null },
          }),
        );
      } else {
        dependenciesToTest = test.dependencies.map(
          (dependency) => ({ ...dependency, entire: { ...dependency.entire, type: test.type } }),
        );
      }

      const pathDecoded = Buffer.from(project.pathEncoded, 'base64');
      describe(`installing ${dependenciesToTest.map((d) => `${d.name}@${d.version}`)} as ${test.type} with ${test.repo} to ${pathDecoded}`, () => { // tslint:disable:max-line-length
        it('should install new dependencies', (done) => {
          api(app)
            .post(`/api/project/${project.pathEncoded}/dependencies/${test.type}/${test.repo}`)
            .send(dependenciesToTest.map((d) => ({ version: d.version, name: d.name })))
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              done();
            });
        });

        it('should return all dependencies (and new ones)', (done) => {
          api(app)
            .get(`/api/project/${project.pathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.include(dependenciesToTest[0].entire);
              expect(res.body).to.deep.include(dependenciesToTest[1].entire);
              done();
            });
        });
      });

      describe(`uninstalling ${dependenciesToTest.map((d) => `${d.name}@${d.version}`)} as ${test.type} with ${test.repo} to ${pathDecoded}`, () => { // tslint:disable:max-line-length
        it('should remove previously installed dependencies', (done) => {
          // use single delete here per each (for now UI doesnt support multiple deletion)
          api(app)
            .delete(`/api/project/${project.pathEncoded}/dependencies/${test.type}/${test.repo}/${dependenciesToTest[0].name}`) // tslint:disable:max-line-length
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.equal({});
              api(app)
                .delete(`/api/project/${project.pathEncoded}/dependencies/${test.type}/${test.repo}/${dependenciesToTest[1].name}`) // tslint:disable:max-line-length
                .end((__: any, res2: api.Response) => {
                  expect(res2.status).to.equal(200);
                  expect(res2.body).to.deep.equal({});
                  done();
                });
            });
        });

        it('should return all dependencies (without new ones)', (done) => {
          api(app)
            .get(`/api/project/${project.pathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.not.include(dependenciesToTest[0].entire);
              expect(res.body).to.not.include(dependenciesToTest[1].entire);
              done();
            });
        });
      });

      // TODO install as newest
    });
  });
});
