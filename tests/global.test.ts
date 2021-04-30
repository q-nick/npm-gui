import api from 'supertest';
import { expect } from 'chai';
import { app } from '../server';
import { HTTP_STATUS_OK } from '../server/utils/utils';

describe('Global Packages', () => {
  it('all actions should run correctly', async () => {
    // installing
    const responseAdd = await api(app.server).post('/api/global/dependencies')
      .send([{ name: 'npm-gui-tests', version: '1.0.0' }]);
    expect(responseAdd.status).to.equal(HTTP_STATUS_OK);

    // simple list
    const responseSimple = await api(app.server).get('/api/global/dependencies/simple');
    expect(responseSimple.status).to.equal(HTTP_STATUS_OK);
    const npmGuiTestsSimple = responseSimple.body.find((d: any) => d.name === 'npm-gui-tests'); // eslint-disable-line
    expect(npmGuiTestsSimple).to.include({
      name: 'npm-gui-tests',
      manager: 'npm',
      installed: '1.0.0',
    });

    // full list
    const responseFull = await api(app.server).get('/api/global/dependencies/full');
    expect(responseFull.status).to.equal(HTTP_STATUS_OK);
    const npmGuiTestsFull = responseFull.body.find((d: any) => d.name === 'npm-gui-tests'); // eslint-disable-line
    expect(npmGuiTestsFull).to.include({
      name: 'npm-gui-tests',
      manager: 'npm',
      installed: '1.0.0',
      latest: '2.1.1',
    });

    // uninstalling
    const responseUninstall = await api(app.server).delete('/api/global/dependencies/global/npm-gui-tests');
    expect(responseUninstall.status).to.equal(HTTP_STATUS_OK);

    // simple list (no prev pacakge)
    const responseSimple2 = await api(app.server).get('/api/global/dependencies/simple');
    expect(responseSimple2.status).to.equal(HTTP_STATUS_OK);
    const npmGuiTestsSimple2 = responseSimple2.body.find((d: any) => d.name === 'npm-gui-tests'); // eslint-disable-line
    expect(npmGuiTestsSimple2).to.eq(undefined);
  });
});
