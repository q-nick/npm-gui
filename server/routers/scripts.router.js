import express from 'express';
import {
  getScripts,
  addScript,
  removeScript,
  runScript,
} from '../actions/scripts/scripts';

const scriptsRouter = express.Router({ mergeParams: true });// eslint-disable-line

scriptsRouter.get('/', getScripts);
scriptsRouter.post('/', addScript);
scriptsRouter.post('/:scriptName', removeScript);
scriptsRouter.post('/:scriptName/run', runScript);

export { scriptsRouter };
