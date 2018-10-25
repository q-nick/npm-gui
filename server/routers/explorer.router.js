import express from 'express';
import { explorer } from '../actions/explorer/explorer';

const explorerRouter = express.Router();// eslint-disable-line

explorerRouter.get('/', explorer);
explorerRouter.get('/:path', explorer);

export { explorerRouter };
