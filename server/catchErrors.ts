import * as express from 'express';

export const catchErrors = (fn:Function) =>
  (req: express.Request, res: express.Response, next: express.NextFunction) =>
    Promise.resolve(fn(req, res))
      .catch((e) => {
        next(e);
      });
