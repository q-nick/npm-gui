import type { ResponserFunction } from '../../newServerTypes';
import { executeCommandSimple } from '../executeCommand';

export interface Response {
  npm: boolean;
  yarn: boolean;
  pnpm: boolean;
}

export interface API {
  Request: { path?: string };
  Response: Response;
}

export const availableManagers: ResponserFunction = async () => {
  let npm = true;
  let yarn = true;
  let pnpm = true;

  try {
    await executeCommandSimple(undefined, 'npm --version');
  } catch {
    npm = false;
  }

  try {
    await executeCommandSimple(undefined, 'yarn --version');
  } catch {
    yarn = false;
  }

  try {
    await executeCommandSimple(undefined, 'pnpm --version');
  } catch {
    pnpm = false;
  }

  return {
    npm,
    pnpm,
    yarn,
  };
};
