import type { Request, Response } from 'express';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommand } from '../../executeCommand';

async function deleteGlobalNpmDependency(dependencyName: string): Promise<void> {
  await executeCommand(undefined, `npm uninstall ${dependencyName} -g`, true);
}

export const deleteGlobalDependency = async (
  req: Request<{ dependencyName: string }>,
  res: Response,
): Promise<void> => {
  await deleteGlobalNpmDependency(req.params.dependencyName);

  spliceFromCache('global', req.params.dependencyName);

  res.json({});
};
