import express from 'express';
import { info } from '../actions/info/info';

const infoRouter = express.Router();// eslint-disable-line

infoRouter.get('/', info);

export { infoRouter };
