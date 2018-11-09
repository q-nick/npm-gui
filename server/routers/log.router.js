
import Analytics from 'analytics-node';
import express from 'express';

export const logRouter = express.Router();// eslint-disable-line
const client = new Analytics(Buffer.from('aXNpS01OeDNnZ1A0ZlE0VFBqelFvTjdsZDFmejF0NVU=', 'base64').toString());

logRouter.post('/', (req, res) => {
  client.track({
    event: 'npm-gui-start',
    userId: req.body.id,
  });
  res.status(200).send('');
});
