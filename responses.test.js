//here we will test only packed version
//those tests are checking that packed version contain basic endpoints
var request = require('supertest');

var npmGuiServer = require('./npm-gui.js');
var instance = npmGuiServer('localhost', '1338');

describe('GET index.html', function () {
  it('respond with html', function (done) {
    request(instance)
      .get('/index.html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  })
});

describe('GET npm-gui.js', function () {
  it('respond with js', function (done) {
    request(instance)
      .get('/npm-gui.js')
      .expect('Content-Type', /javascript/)
      .expect(200, done);
  })
});

describe('GET vendor.js', function () {
  it('respond with js', function (done) {
    request(instance)
      .get('/vendor.js')
      .expect('Content-Type', /javascript/)
      .expect(200, done);
  })
});

describe('API: /modules', function () {
  it('GET should return json', function (done) {
    request(instance)
      .get('/modules')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
});

describe('API: /devModules', function () {
  it('GET should return json', function (done) {
    request(instance)
      .get('/devModules')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
});

describe('API: /tasks', function () {
  it('GET should return json', function (done) {
    request(instance)
      .get('/tasks')
      .expect('Content-Type', /json/)
      .expect(200, done);
  })
});
