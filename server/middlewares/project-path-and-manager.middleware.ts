import { existsSync } from 'fs';
import path from 'path';

import type { MiddlewareFunction } from '../types/new-server.types';

export const decodePath = (pathEncoded: string): string => {
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
};

export const isYarnProject = (projectPath: string): boolean => {
  return existsSync(path.join(projectPath, 'yarn.lock'));
};

export const isPnpmProject = (projectPath: string): boolean => {
  return existsSync(path.join(projectPath, 'pnpm-lock.yaml'));
};

export const isNpmProject = (projectPath: string): boolean => {
  return existsSync(path.join(projectPath, 'package.json'));
};

export const projectPathAndManagerMiddleware: MiddlewareFunction<{
  projectPath: string;
}> = ({ params: { projectPath } }) => {
  const projectPathDecoded = decodePath(projectPath);

  const isYarn = isYarnProject(projectPathDecoded);
  const isNpm = isNpmProject(projectPathDecoded);
  const isPnpm = isPnpmProject(projectPathDecoded);

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
