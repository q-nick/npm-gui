import type { ErrorRequestHandler, Response, NextFunction } from 'express';

export const errorHandler: ErrorRequestHandler = (
  err: unknown, _: unknown, res: Response, next: NextFunction,
) => {
  // No routes handled the request and no system error, that means 404 issue.
  // Forward to next middleware to handle it.
  console.error('ERROR HANDLER', err);

  if (!err) {
    next();
    return;
  }

  res.status(400).send(err);
};