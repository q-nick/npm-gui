const api = require('supertest');
const { expect } = require('chai');
const { app } = require('../server');
const { npmGuiPackage } = require('./npmGuiPackage');

const testProjectPathEncoded = 'dGVzdC1wcm9qZWN0';

describe('Regular Packages', () => {
  describe('installing', () => {
    it('should install new package', (done) => {
      api(app)
        .post(`/api/project/${testProjectPathEncoded}/dependencies/regular/npm`)
        .send({ packageName: 'npm-gui', version: '0.2.1' })
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    }).timeout(40000);

    it('should return all packages (and new one)', (done) => {
      api(app)
        .get(`/api/project/${testProjectPathEncoded}/dependencies/regular`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.include(npmGuiPackage);
          done();
        });
    }).timeout(40000);
  });

  describe('uninstalling', () => {
    it('should remove previously installed package', (done) => {
      api(app)
        .delete(`/api/project/${testProjectPathEncoded}/dependencies/regular/npm/npm-gui`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.deep.equal({});
          done();
        });
    }).timeout(40000);

    it('should return all packages (without new one)', (done) => {
      api(app)
        .get(`/api/project/${testProjectPathEncoded}/dependencies/regular`)
        .end((err, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.not.include(npmGuiPackage);
          done();
        });
    }).timeout(40000);
  });
});
