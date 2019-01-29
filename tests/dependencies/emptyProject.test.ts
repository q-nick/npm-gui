import * as api from 'supertest';
import { expect } from 'chai';
import { app } from '../../server';

const pathEncoded = 'dGVzdHMvcHJvamVjdHMvZW1wdHk=';

describe('empty project tests', () => {
  describe('should return empty dependencies', () => {
    it('simple', (done) => {
      api(app)
        .get(`/api/project/${pathEncoded}/dependencies/simple`)
        .end((_: any, res: api.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal([]);
          done();
        });
    });

    it('entire', (done) => {
      api(app)
        .get(`/api/project/${pathEncoded}/dependencies`)
        .end((_: any, res: api.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal([]);
          done();
        });
    });
  });

  describe('should block installation of any dependency', () => {
    it('npm', (done) => {
      api(app)
        .post(`/api/project/${pathEncoded}/dependencies/prod/npm`)
        .send([{ name: 'that-value', version: '0.1.1' }])
        .end((_: any, res: api.Response) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.deep.equal(null);
          done();
        });
    });

    it('bower', (done) => {
      api(app)
        .post(`/api/project/${pathEncoded}/dependencies/prod/bower`)
        .send([{ name: 'that-value', version: '0.1.1' }])
        .end((_: any, res: api.Response) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.deep.equal(null);
          done();
        });
    });
  });

  describe('should block deletion of any dependency', () => {
    it('npm', (done) => {
      api(app)
        .delete(`/api/project/${pathEncoded}/dependencies/prod/npm/that-value`)
        .end((_: any, res: api.Response) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.deep.equal(null);
          done();
        });
    });

    it('bower', (done) => {
      api(app)
        .delete(`/api/project/${pathEncoded}/dependencies/prod/bower/that-value`)
        .end((_: any, res: api.Response) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.deep.equal(null);
          done();
        });
    });
  });
});
