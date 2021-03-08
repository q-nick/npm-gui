import type { NextFunction, Request, Response } from 'express';
import path from 'path';
import * as fs from 'fs';

export function decodePath(pathEncoded: string): string {
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
}

export function hasYarn(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'yarn.lock'));
}

export function hasNpm(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'package.json'));
}

export const projectPathAndNpmYarnMiddleware = (req: Request<{ projectPath?: string }>, _: Response, next: NextFunction): void => { // eslint-disable-line max-len
  if (req.params.projectPath === undefined) {
    throw new Error('project path not found!');
  }
  const projectPathDecoded = decodePath(req.params.projectPath);

  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

  if (!yarn && !npm) {
    throw new Error('npm or yarn not found!');
  }

  req.projectPathDecoded = projectPathDecoded;
  req.yarnLock = yarn;
  next();
};
