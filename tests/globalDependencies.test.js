const api = require('supertest');
const { expect } = require('chai');
const { app } = require('../server');
const { npmGuiTestsPackage } = require('./npmGuiTestsPackage');

const testProjectPathEncoded = 'dGVzdC1wcm9qZWN0';

describe('Global Packages', () => {
  describe('installing', () => {
    it('should install new package globally', (done) => {
      api(app)
        .post(`/api/project/${testProjectPathEncoded}/dependencies/global/npm`)
        .send([{ packageName: 'npm-gui-tests', version: '1.0.0' }])
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    }).timeout(40000);

    it('should return all global packages (and new one)', (done) => {
      api(app)
        .get(`/api/project/${testProjectPathEncoded}/dependencies/global`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          const npmGuiTests = res.body.filter(d => d.name === 'npm-gui-tests')[0];
          expect(npmGuiTests).to.include({
            name: 'npm-gui-tests',
            repo: 'npm',
            required: '1.0.0',
            installed: '1.0.0',
            latest: '2.1.1',
          });
          done();
        });
    }).timeout(40000);
  });

  describe('uninstalling', () => {
    it('should remove previously installed package', (done) => {
      api(app)
        .delete(`/api/project/${testProjectPathEncoded}/dependencies/global/npm/npm-gui-tests`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    }).timeout(40000);

    it('should return all global packages (without new one)', (done) => {
      api(app)
        .get(`/api/project/${testProjectPathEncoded}/dependencies/global`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.not.include({ ...npmGuiTestsPackage, required: '0.2.1' });
          done();
        });
    }).timeout(40000);
  });
});
