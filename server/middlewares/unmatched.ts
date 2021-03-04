import type { RequestHandler } from 'express';
import path from 'path';

export const unmatchedHandler: RequestHandler = (_, res) => {
  res.sendFile(path.join(__dirname, '/../client', 'index.html'));
};
