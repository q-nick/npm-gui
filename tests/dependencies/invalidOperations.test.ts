import api from 'supertest';
import { expect } from 'chai';
import { app } from '../../server';

const repos = [
  {
    projectPath: 'dGVzdHMvcHJvamVjdHMvbnBt',
    describe: 'npm',
    name: 'npm',
  },
  {
    projectPath: 'dGVzdHMvcHJvamVjdHMveWFybg==',
    describe: 'yarn',
    name: 'npm',
  },
];

describe('installation errors', () => {
  repos.forEach((repo) => {
    describe(repo.describe || repo.name, () => {
      it('invalid tag version', (done) => {
        api(app)
          .post(`/api/project/${repo.projectPath}/dependencies/prod/${repo.name}`)
          .send([{ name: 'that-value', version: '1.0.0' }])
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('invalid tag version (multiple)', (done) => {
        api(app)
          .post(`/api/project/${repo.projectPath}/dependencies/prod/${repo.name}`)
          .send([
            { name: 'that-value', version: '5.0.0' },
            { name: 'npm-gui-tests', version: '5.0.0' }])
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('invalid name', (done) => {
        api(app)
          .post(`/api/project/${repo.projectPath}/dependencies/prod/${repo.name}`)
          .send([{ name: 'efasefaseasegasegasefasesasegasegasegsagsxzsa', version: '1.0.0' }])
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('invalid name (multiple)', (done) => {
        api(app)
          .post(`/api/project/${repo.projectPath}/dependencies/prod/${repo.name}`)
          .send([
            { name: 'efasefaseasegasegasefasesasegasegasegsagsxzsa', version: '1.0.0' },
            { name: 'efasefaseasegasegasefasesasegasegsadfasdfasegsagsxzsa', version: '1.0.0' },
          ])
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('malformed / undefined', (done) => {
        api(app)
          .post(`/api/project/${repo.projectPath}/dependencies/prod/${repo.name}`)
          .send([{ }])
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('malformed / undefined (multiple)', (done) => {
        api(app)
          .post(`/api/project/${repo.projectPath}/dependencies/prod/${repo.name}`)
          .send([{ }, { }])
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('error');
            done();
          });
      });

      it('get test', (done) => {
        api(app)
          .get(`/api/project/${repo.projectPath}/dependencies/`)
          .end((_: any, res: api.Response) => {
            expect(res.status).to.equal(200);
            expect(res.body).to.deep.equal([]);
            done();
          });
      });
    });
  });
});
