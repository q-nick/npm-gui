const api = require('supertest');
const { expect } = require('chai');
const { app } = require('../server');

const testProjectPathEncoded = 'dGVzdC1wcm9qZWN0';

describe('Explorer', () => {
  it('should return result of pwd when given path is undefined', (done) => {
    api(app)
      .get('/api/explorer/')
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property('path');
        expect(res.body.ls).to.deep.include({
          isDirectory: true,
          isProject: false,
          name: 'test-project',
        });
        done();
      });
  }).timeout(40000);

  it('should return result when path is defined', (done) => {
    api(app)
      .get(`/api/explorer/${testProjectPathEncoded}`)
      .end((err, res) => {
        expect(res.statusCode).to.equal(200);
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
