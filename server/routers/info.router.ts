import * as express from 'express';
import { info } from '../actions/info/info';

const infoRouter = express.Router();

infoRouter.get('/', info);

export { infoRouter };
