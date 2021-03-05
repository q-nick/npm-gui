import type { ErrorRequestHandler, Response, NextFunction } from 'express';
import { HTTP_STATUS_BAD_REQUEST } from '../utils/utils';

export const errorHandler: ErrorRequestHandler = (
  err: unknown, _: unknown, res: Response, next: NextFunction,
) => {
  // No routes handled the request and no system error, that means 404 issue.
  // Forward to next middleware to handle it.
  console.error('ERROR HANDLER', err);

  if (err === undefined || err === null) {
    next();
    return;
  }

  res.status(HTTP_STATUS_BAD_REQUEST).send(err);
};
