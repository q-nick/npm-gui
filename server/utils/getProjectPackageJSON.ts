import * as fs from 'fs';
import * as path from 'path';
import { parseJSON } from './parseJSON';

interface PackageJSON {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export function getProjectPackageJSON(projectPath: string): PackageJSON | null {
  const packageJSONpath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJSONpath)) {
    return parseJSON<PackageJSON>(fs.readFileSync(packageJSONpath, { encoding: 'utf8' }));
  }

  return null;
}

export function getDependenciesFromPackageJson(projectPath: string): Record<string, string> {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null || !('dependencies' in packageJson)) {
    return {};
  }
  return packageJson.dependencies ?? {};
}

export function getDevDependenciesFromPackageJson(projectPath: string): Record<string, string> {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null || !('devDependencies' in packageJson)) {
    return {};
  }
  return packageJson.devDependencies ?? {};
}

export function getTypeFromPackageJson(projectPath: string, dependencyName: string): 'dev' | 'extraneous' | 'prod' {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null) {
    console.log('ERROR????');
    return 'extraneous';
  }

  const { dependencies, devDependencies } = packageJson;

  if (dependencies && dependencyName in dependencies) {
    return 'prod';
  }

  if (devDependencies && dependencyName in devDependencies) {
    return 'dev';
  }

  return 'extraneous';
}

export function getRequiredFromPackageJson(
  projectPath: string, dependencyName: string,
): string | undefined {
  const packageJson = getProjectPackageJSON(projectPath);
  if (packageJson === null) {
    return undefined;
  }

  const { dependencies, devDependencies } = packageJson;

  if (dependencies && dependencyName in dependencies) {
    return dependencies[dependencyName];
  }

  if (devDependencies && dependencyName in devDependencies) {
    return devDependencies[dependencyName];
  }

  return undefined;
}
