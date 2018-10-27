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
scriptsRouter.delete('/:scriptName', removeScript);
scriptsRouter.post('/:scriptName/run', runScript);

export { scriptsRouter };
