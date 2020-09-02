import express from 'express';

export const catchErrors = (
  fn: (req: express.Request, res: express.Response)=> Promise<void>,
): any => (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => Promise.resolve(fn(req, res))
  .catch((e) => {
    next(e);
  });
