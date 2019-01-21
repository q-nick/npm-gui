import * as api from 'supertest';
import { expect } from 'chai';
import { app } from '../server';

const testProjectPathEncoded = 'dGVzdHMvcHJvamVjdHMvbnBt';

describe('Explorer', () => {
  it('should return result of pwd when given path is undefined', (done) => {
    api(app)
      .get('/api/explorer/')
      .end((_:any, res:api.Response) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('path');
        expect(res.body.ls).to.deep.include({
          isDirectory: true,
          isProject: false,
          name: 'tests',
        });
        done();
      });
  }).timeout(40000);

  it('should return result when path is defined', (done) => {
    api(app)
      .get(`/api/explorer/${testProjectPathEncoded}`)
      .end((_, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('path');
        expect(res.body.ls).to.deep.include({
          isDirectory: false,
          isProject: false,
          name: 'iam-test-project.txt',
        });
        expect(res.body.ls).to.deep.include({
          isDirectory: false,
          isProject: true,
          name: 'package.json',
        });
        expect(res.body.ls).to.deep.include({
          isDirectory: true,
          isProject: false,
          name: 'empty',
        });
        done();
      });
  }).timeout(40000);
});
