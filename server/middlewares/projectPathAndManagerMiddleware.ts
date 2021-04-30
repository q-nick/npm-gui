import path from 'path';
import * as fs from 'fs';
import type { MiddlewareFunction } from '../newServerTypes';

export function decodePath(pathEncoded: string): string {
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
}

export function hasYarn(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'yarn.lock'));
}

export function hasPnpm(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'pnpm-lock.yaml'));
}

export function hasNpm(projectPath: string): boolean {
  return fs.existsSync(path.join(projectPath, 'package.json'));
}

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

  let manager = 'npm'; // default

  if (isPnpm) { // special
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
