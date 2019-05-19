
import analyticsNode = require('analytics-node');
import * as express from 'express';

export const logRouter = express.Router();
const client = new analyticsNode(
  Buffer.from('NjBWYkZnMmFVajB3Mjlib2NyZm1xc1lZS1FRS2tKdFQ=', 'base64').toString());

logRouter.post('/', (req, res) => {
  client.track({
    event: 'npm-gui-start',
    userId: req.body.id,
  });
  res.status(200).send('');
});
