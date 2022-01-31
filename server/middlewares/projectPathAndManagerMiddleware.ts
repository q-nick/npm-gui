import { existsSync } from 'fs';
import path from 'path';

import type { MiddlewareFunction } from '../newServerTypes';

export const decodePath = (pathEncoded: string): string => {
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
};

export const hasYarn = (projectPath: string): boolean => {
  return existsSync(path.join(projectPath, 'yarn.lock'));
};

export const hasPnpm = (projectPath: string): boolean => {
  return existsSync(path.join(projectPath, 'pnpm-lock.yaml'));
};

export const hasNpm = (projectPath: string): boolean => {
  return existsSync(path.join(projectPath, 'package.json'));
};

export const projectPathAndManagerMiddleware: MiddlewareFunction = ({
  params: { projectPath },
}) => {
  if (projectPath === undefined) {
    throw new Error('project path not found!');
  }
  const projectPathDecoded = decodePath(projectPath);

  const isYarn = hasYarn(projectPathDecoded);
  const isNpm = hasNpm(projectPathDecoded);
  const isPnpm = hasPnpm(projectPathDecoded);

  if (!isYarn && !isNpm && !isPnpm) {
    throw new Error('invalid project structure!');
  }

  // default
  let manager = 'npm';

  if (isPnpm) {
    // special
    manager = 'pnpm';
  } else if (isYarn) {
    manager = 'yarn';
  }

  return {
    projectPathDecoded,
    manager,
    xCache: 'any',
  };
};
