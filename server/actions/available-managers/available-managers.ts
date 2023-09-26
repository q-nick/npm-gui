import { publicProcedure } from '../../trpc/trpc-router';
import { executeCommandSimple } from '../execute-command';

export const availableManagersProcedure = publicProcedure.query(async () => {
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
});
