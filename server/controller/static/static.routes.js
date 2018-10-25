import express from 'express';

const staticRouter = express.Router(); // eslint-disable-line

function staticByPath(staticPath) {
  staticRouter.use(express.static(
    `${staticPath}`,
    {
      index: ['index.html', 'index.htm'],
    }));

  staticRouter.use('/node_modules', express.static('node_modules'));

  return staticRouter;
}

export default {
  onPath: staticByPath,
};
