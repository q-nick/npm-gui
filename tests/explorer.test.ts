import { expect } from 'chai';
import path from 'path';
import api from 'supertest';

import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';
import { encodePath, prepareTestProject } from './tests-utils';

describe('Explorer', () => {
  it('should return result of pwd when given path is undefined', async () => {
    await prepareTestProject('npm');
    const response = await api(app.server).get('/api/explorer/');
    expect(response.status).to.equal(HTTP_STATUS_OK);
    expect(response.body).to.have.property('path');

    expect(response.body.ls).to.deep.include({
      isDirectory: true,
      isProject: false,
      name: 'tests',
    });
  });

  it('should return result when path is defined', async () => {
    await prepareTestProject('yarn');
    const response = await api(app.server).get(
      `/api/explorer/${encodePath(path.join(__dirname, 'test-project'))}`,
    );
    expect(response.status).to.equal(HTTP_STATUS_OK);
    expect(response.body).to.have.property('path');

    expect(response.body.ls).to.deep.include({
      isDirectory: false,
      isProject: true,
      name: 'yarn.lock',
    });

    expect(response.body.ls).to.deep.include({
      isDirectory: false,
      isProject: true,
      name: 'package.json',
    });
  });
});
