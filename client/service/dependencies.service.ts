import type {
  Basic,
  BundleScore,
  BundleSize,
  DependencyInstalled,
  Manager,
  Type,
} from '../../server/types/dependency.types';
import { xCacheId } from '../xcache';
import { fetchJSON, fetchQueuedJSON, getBasePathFor } from './utils';

export const getProjectDependenciesFast = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  return fetchJSON(`${getBasePathFor(projectPath)}/simple`);
};

export const getProjectDependenciesFull = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  return fetchJSON(`${getBasePathFor(projectPath)}/full`, {
    headers: { 'x-cache-id': xCacheId },
  });
};

export const getDependencyScore = async (
  dependencyName: string,
): Promise<BundleScore> => {
  return fetchQueuedJSON(`api/score/${dependencyName}`);
};

export const getDependencySize = async (
  dependencyName: string,
  installedVersion?: string | null,
): Promise<BundleSize> => {
  return fetchQueuedJSON(
    `api/bundle-size/${dependencyName}@${installedVersion}`,
  );
};

export const installDependencies = async (
  projectPath: string,
  type: Type,
  dependencies: Basic[],
): Promise<void> => {
  return fetchJSON(`${getBasePathFor(projectPath)}/${type}`, {
    method: 'POST',
    body: JSON.stringify(dependencies),
    headers: { 'x-cache-id': xCacheId },
  });
};

export const installAllDependencies = async (
  projectPath: string,
  manager?: Manager,
): Promise<void> => {
  return fetchJSON(
    `${getBasePathFor(projectPath)}/install${manager ? `/${manager}` : ''}`,
    { method: 'POST', headers: { 'x-cache-id': xCacheId } },
  );
};

export const deleteDependency = async (
  projectPath: string,
  dependency: Basic,
): Promise<void> => {
  return fetchJSON(
    `${getBasePathFor(projectPath)}/${dependency.type}/${dependency.name}`,
    { method: 'DELETE', headers: { 'x-cache-id': xCacheId } },
  );
};

export const updateDependencies = async (
  projectPath: string,
  dependenciesToUpdateDevelopment: Basic[],
  dependenciesToUpdateProduction: Basic[],
): Promise<void> => {
  await fetchJSON(`${getBasePathFor(projectPath)}/dev`, {
    method: 'POST',
    body: JSON.stringify(dependenciesToUpdateDevelopment),
    headers: { 'x-cache-id': xCacheId },
  });
  await fetchJSON(`${getBasePathFor(projectPath)}/prod`, {
    method: 'POST',
    body: JSON.stringify(dependenciesToUpdateProduction),
    headers: { 'x-cache-id': xCacheId },
  });
};
