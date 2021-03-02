import express from 'express';
import { catchErrors } from '../catchErrors';
import { requestWithPromise } from '../requestWithPromise';

export const logRouter = express.Router();

logRouter.post('/', catchErrors(async (req, res) => {
  const result = await requestWithPromise(`https://npm-gui-stats.herokuapp.com/log/${req.body.id}`);
  res.status(200).send(result);
}));
