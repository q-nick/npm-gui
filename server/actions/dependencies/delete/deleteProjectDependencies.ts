import type express from 'express';
import {executeCommand} from '../../executeCommand';
// import { withCacheSplice } from '../../../cache';
import { decodePath } from '../../decodePath';
import { hasYarn, hasNpm } from '../../hasYarn';
import type * as Dependency from '../../../Dependency';

async function deleteNpmDependency(
  projectPath: string, dependencyName: string, type: Dependency.Type,
): Promise<string> {
  // delete
  await executeCommand(projectPath, `npm uninstall ${dependencyName} -${type === 'prod' ? 'S' : 'D'}`, true);
  return dependencyName;
}

// async function deleteYarnDependency(
//   projectPath: string, dependencyName: string
// ): Promise<string> {
//   // delete
//   await executeCommand(projectPath, `yarn remove ${dependencyName}`, true);

//   return dependencyName;
// }

export async function deleteDependency(
  req: express.Request<{
    repoName: string; projectPath: unknown; type: Dependency.Type; packageName: string;
  }>,
  res: express.Response
): Promise<void> {
  const {
    repoName, projectPath, type, packageName,
  } = req.params;

  const projectPathDecoded = decodePath(projectPath);
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

  if (repoName === 'npm') {
    if (yarn || npm) {
      // await withCacheSplice(
      //   yarn ? deleteYarnDependency : deleteNpmDependency,
      //   `${req.headers['x-cache-id']}-${projectPath}-npm`, 'name',
      //   projectPathDecoded, packageName, type,
      // );
      await deleteNpmDependency(projectPathDecoded, packageName, type);
      res.json({});
    } else {
      res.status(400).json(null);
    }
  }
}
