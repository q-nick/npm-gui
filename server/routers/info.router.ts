import express from 'express';
import { catchErrors } from '../catchErrors';
import { requestWithPromise } from '../requestWithPromise';

const infoRouter = express.Router();

infoRouter.get('/', catchErrors(async (_, res): Promise<void> => {
  const result = await requestWithPromise(`https://raw.githubusercontent.com/q-nick/npm-gui/master/INFO?${new Date().getTime()}`);
  res.send(result);
}));

export { infoRouter };
