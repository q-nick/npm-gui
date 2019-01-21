import * as express from 'express';
import { explorer } from '../actions/explorer/explorer';

const explorerRouter = express.Router();

explorerRouter.get('/', explorer);
explorerRouter.get('/:path', explorer);

export { explorerRouter };
