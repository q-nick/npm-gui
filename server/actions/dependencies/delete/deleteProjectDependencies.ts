import type { Request, Response } from 'express';
import type * as Dependency from '../../../types/Dependency';
import { spliceFromCache } from '../../../utils/cache';
import { executeCommandJSON } from '../../executeCommand';

const commandTypeFlag = {
  prod: '-S',
  dev: '-D',
  global: '-g',
  extraneous: '',
};

async function deleteNpmDependency(
  projectPath: string | undefined, packageName: string, type: Dependency.Type,
): Promise<void> {
  // delete
  await executeCommandJSON(projectPath, `npm uninstall ${packageName} ${commandTypeFlag[type]} --json`, true);
}

// async function deleteYarnDependency(
//   projectPath: string, dependencyName: string
// ): Promise<string> {
//   // delete
//   await executeCommand(projectPath, `yarn remove ${dependencyName}`, true);

//   return dependencyName;
// }

export const deleteDependency = async (
  req: Request<{ type?: Dependency.Type; dependencyName: string }>,
  res: Response,
): Promise<void> => {
  const { type = 'global', dependencyName } = req.params;

  await deleteNpmDependency(req.projectPathDecoded, dependencyName, type);

  spliceFromCache(req.projectPathDecoded, dependencyName);

  res.json({});
};
