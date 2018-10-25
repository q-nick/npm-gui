import express from 'express';
import { search } from '../actions/search/search';

const searchRouter = express.Router();// eslint-disable-line

searchRouter.post('/:repoName', search);

export { searchRouter };
