import * as express from 'express';
import {
  getScripts,
  addScript,
  removeScript,
  runScript,
} from '../actions/scripts/scripts';

const scriptsRouter = express.Router({ mergeParams: true });

scriptsRouter.get('/', getScripts);
scriptsRouter.post('/', addScript);
scriptsRouter.delete('/:scriptName', removeScript);
scriptsRouter.get('/:scriptName/run', runScript);

export { scriptsRouter };
