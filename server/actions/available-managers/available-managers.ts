import type { AvailableManagerResponse } from '../../types/global.types';
import type { ResponserFunction } from '../../types/new-server.types';
import { executeCommandSimple } from '../execute-command';

export const availableManagers: ResponserFunction<
  { path?: string },
  unknown,
  AvailableManagerResponse
> = async () => {
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
