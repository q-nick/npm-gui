import * as api from 'supertest';
import { expect } from 'chai';
import { app } from '../server';

describe('Global Packages', () => {
  describe('installing', () => {
    it('should install new package globally', (done) => {
      api(app)
        .post('/api/global/dependencies/npm')
        .send([{ name: 'npm-gui-tests', version: '1.0.0' }])
        .end((_:any, res:api.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('should return all global packages (and new one)', (done) => {
      api(app)
        .get('/api/global/dependencies')
        .end((_:any, res:api.Response) => {
          expect(res.status).to.equal(200);
          const npmGuiTests = res.body.filter((d:any) => d.name === 'npm-gui-tests')[0];
          expect(npmGuiTests).to.include({
            name: 'npm-gui-tests',
            repo: 'npm',
            required: '1.0.0',
            installed: '1.0.0',
            latest: '2.1.1',
          });
          done();
        });
    });
  });

  describe('uninstalling', () => {
    it('should remove previously installed package', (done) => {
      api(app)
        .delete('/api/global/dependencies/npm/npm-gui-tests')
        .end((_:any, res:api.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    });

    it('should return all global packages (without new one)', (done) => {
      api(app)
        .get('/api/global/dependencies')
        .end((_:any, res:api.Response) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.not.include({
            name: 'npm-gui-tests',
            repo: 'npm',
            required: '1.0.0',
            installed: '1.0.0',
            latest: '2.1.1',
          });
          done();
        });
    });
  });
});
