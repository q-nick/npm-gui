import path from 'path';
import * as fs from 'fs';
import type { MiddlewareFunction } from '../newServerTypes';

export function decodePath(pathEncoded: string): string {
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
}

export function hasYarn(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'yarn.lock'));
}

export function hasNpm(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'package.json'));
}

export const projectPathAndNpmYarnMiddleware: MiddlewareFunction = ({
  params: { projectPath },
}) => {
  if (projectPath === undefined) {
    throw new Error('project path not found!');
  }
  const projectPathDecoded = decodePath(projectPath);

  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

  if (!yarn && !npm) {
    throw new Error('npm or yarn not found!');
  }

  return {
    projectPathDecoded,
    yarnLock: yarn,
    xCache: 'any',
  };
};
