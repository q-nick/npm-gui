import express from 'express';
import { info } from '../actions/info/info';
import { catchErrors } from '../catchErrors';

const infoRouter = express.Router();

infoRouter.get('/', catchErrors(info));

export { infoRouter };
