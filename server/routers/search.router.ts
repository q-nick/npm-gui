import express from 'express';
import { search } from '../actions/search/search';
import { catchErrors } from '../catchErrors';

const searchRouter = express.Router();

searchRouter.post('/:repoName', catchErrors(search));

export { searchRouter };
