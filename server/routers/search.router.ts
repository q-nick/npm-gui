import * as express from 'express';
import { search } from '../actions/search/search';

const searchRouter = express.Router();

searchRouter.post('/:repoName', search);

export { searchRouter };
