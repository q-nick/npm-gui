import type {
  Request, Response, NextFunction
} from 'express';

export const catchErrors = (
  fn: (req: Request<any>, res: Response) => Promise<void>,
): any => async (
  req: Request<any>,
  res: Response,
  next: NextFunction,
): Promise<void> => Promise.resolve(fn(req, res))
  .catch((e) => {
    next(e);
  });
