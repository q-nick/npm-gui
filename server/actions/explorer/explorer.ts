import { existsSync, lstatSync, readdirSync } from 'fs';
import path from 'path';
import { z } from 'zod';

import { publicProcedure } from '../../trpc/trpc-router';

export const explorerProcedure = publicProcedure
  .input(z.string().optional())
  .query(async ({ input: pathString }) => {
    let normalizedPath =
      pathString === undefined ? null : path.normalize(pathString);

    let changed = false;

    if (normalizedPath === null || !existsSync(normalizedPath)) {
      normalizedPath = process.cwd();
      changed = true;
    }

    const ls = readdirSync(normalizedPath).map((name) => ({
      name,
      isDirectory: lstatSync(`${normalizedPath}/${name}`).isDirectory(),
      isProject: [
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
      ].includes(name),
    }));

    return {
      ls,
      changed,
      path: normalizedPath,
    };
  });
