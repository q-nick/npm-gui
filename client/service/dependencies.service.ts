import type {
  Basic,
  BundleDetails,
  BundleScore,
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

export const getDependencyDetails = async (
  manager: Manager,
  dependencyName: string,
  installedVersion?: string | null,
): Promise<BundleDetails> => {
  return fetchQueuedJSON(
    `api/extras/${manager}/${dependencyName}@${installedVersion}`,
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

export const reinstall = async (
  projectPath: string,
  manager?: Manager,
): Promise<void> => {
  return fetchJSON(
    `${getBasePathFor(projectPath)}/install${manager ? `/${manager}` : ''}`,
    { method: 'POST', headers: { 'x-cache-id': xCacheId } },
  );
};

export const deleteDependencies = async (
  projectPath: string,
  type: Type,
  dependencies: Basic[],
): Promise<void> => {
  return fetchJSON(`${getBasePathFor(projectPath)}/${type}`, {
    method: 'DELETE',
    body: JSON.stringify(dependencies),
    headers: { 'x-cache-id': xCacheId },
  });
};
