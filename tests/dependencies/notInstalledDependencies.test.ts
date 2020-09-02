import api from 'supertest';
import { expect } from 'chai';
import * as rimraf from 'rimraf';
import * as path from 'path';
import * as fs from 'fs';
import { projects } from './_testableDependency';
import { app } from '../../server';

function clearProject(projectPath: string): void {
  rimraf.sync(path.join(`${projectPath}`, 'node_modules'));
  rimraf.sync(path.join(`${projectPath}`, 'bower_components'));
  rimraf.sync(path.join(`${projectPath}`, 'package-lock.json'));
  if (fs.existsSync(path.join(`${projectPath}`, 'yarn.lock'))) {
    fs.writeFileSync(path.join(`${projectPath}`, 'yarn.lock'), '');
  }
}

// TODO REFACTOR
describe('not installed project', () => {
  projects.forEach((project) => {
    project.tests.forEach((test) => {
      const dependenciesToTest = test.dependencies.map(
        (dependency) => ({
          ...dependency,
          entire: {
            ...dependency.entire,
            type: test.type,
            installed: null,
          },
        }),
      );

      const pathDecoded = Buffer.from(project.pathEncoded, 'base64');

      describe(`${test.repo} ${pathDecoded}`, () => {
        it('prepare project', (done) => {
          api(app)
            .post(`/api/project/${project.pathEncoded}/dependencies/${test.type}/${test.repo}`)
            .send(dependenciesToTest.map((d) => ({ version: d.version, name: d.name })))
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              clearProject(pathDecoded.toString());
              done();
            });
        });

        it('get simple', (done) => {
          api(app)
            .get(`/api/project/${project.pathEncoded}/dependencies/simple`)
            .end((_: any, res: api.Response) => {
              expect(res.status).to.equal(200);
              expect(res.body).to.deep.include({
                name: dependenciesToTest[0].name,
                required: dependenciesToTest[0].entire.required,
                type: dependenciesToTest[0].entire.type,
                repo: dependenciesToTest[0].entire.repo,
              });
              expect(res.body).to.deep.include({
                name: dependenciesToTest[1].name,
                required: dependenciesToTest[1].entire.required,
                type: dependenciesToTest[1].entire.type,
                repo: dependenciesToTest[1].entire.repo,
              });
              done();
            });
        });

        it('get entire', (done) => {
          api(app)
            .get(`/api/project/${project.pathEncoded}/dependencies`)
            .end((_: any, res: api.Response) => {
              if (dependenciesToTest[0].entire.repo === 'yarn') {
                expect(res.body).to.deep.include({
                  name: dependenciesToTest[0].name,
                  required: dependenciesToTest[0].entire.required,
                  type: dependenciesToTest[0].entire.type,
                  repo: dependenciesToTest[0].entire.repo,
                });
                expect(res.body).to.deep.include({
                  name: dependenciesToTest[1].name,
                  required: dependenciesToTest[1].entire.required,
                  type: dependenciesToTest[1].entire.type,
                  repo: dependenciesToTest[1].entire.repo,
                });
              } else {
                expect(res.status).to.equal(200);
                expect(res.body).to.deep.include(dependenciesToTest[0].entire);
                expect(res.body).to.deep.include(dependenciesToTest[1].entire);
              }
              done();
            });
        });

        it('clear project', (done) => {
          clearProject(pathDecoded.toString());
          done();
        });
      });
    });
  });
});
