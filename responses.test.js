// here we will test only packed version
// those tests are checking that packed version contain basic endpoints
const request = require('supertest');
const npmGuiServer = require('./npm-gui.js');

const instance = npmGuiServer('localhost', '1338');

describe('GET index.html', () => {
  it('respond with html', (done) => {
    request(instance)
      .get('/index.html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });
});

describe('GET npm-gui.js', () => {
  it('respond with js', (done) => {
    request(instance)
      .get('/npm-gui.js')
      .expect('Content-Type', /javascript/)
      .expect(200, done);
  });
});

describe('GET vendor.js', () => {
  it('respond with js', (done) => {
    request(instance)
      .get('/vendor.js')
      .expect('Content-Type', /javascript/)
      .expect(200, done);
  });
});

describe('API: /modules', () => {
  it('GET should return json', (done) => {
    request(instance)
      .get('/modules')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('API: /devModules', () => {
  it('GET should return json', (done) => {
    request(instance)
      .get('/devModules')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('API: /tasks', () => {
  it('GET should return json', (done) => {
    request(instance)
      .get('/tasks')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});
