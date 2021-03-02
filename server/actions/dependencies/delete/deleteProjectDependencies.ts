import type express from 'express';
// import { withCacheSplice } from '../../../cache';
import { decodePath } from '../../decodePath';
import { hasYarn, hasNpm } from '../../hasYarn';
import type * as Dependency from '../../../Dependency';
import { executeCommandJSON } from '../../executeCommand';

async function deleteNpmDependency(
  projectPath: string, packageName: string, type: Dependency.Type,
): Promise<void> {
  // delete
  await executeCommandJSON(projectPath, `npm uninstall ${packageName} -${type === 'prod' ? 'S' : 'D'} --json`, true);
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
    projectPath, type, packageName,
  } = req.params;

  const projectPathDecoded = decodePath(projectPath);
  const yarn = hasYarn(projectPathDecoded);
  const npm = hasNpm(projectPathDecoded);

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
