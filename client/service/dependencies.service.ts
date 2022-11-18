import type {
  Basic,
  BundleDetails,
  BundleScore,
  DependencyInstalled,
  Manager,
  Type,
} from '../../server/types/dependency.types';
import { xCacheId } from '../xcache';
import { fetchJSON, getBasePathFor } from './utils';

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

export const getDependenciesScore = async (
  dependenciesToQuery?: string[],
): Promise<BundleScore[]> => {
  return dependenciesToQuery && dependenciesToQuery.length > 0
    ? await fetchJSON<BundleScore[]>(
        `/api/score/${dependenciesToQuery.join(',')}`,
      )
    : [];
};

export const getDependenciesDetails = async (
  manager?: Manager,
  dependenciesToQuery?: string[],
): Promise<BundleDetails[]> => {
  return manager && dependenciesToQuery && dependenciesToQuery.length > 0
    ? await fetchJSON<BundleDetails[]>(
        `/api/details/${manager}/${dependenciesToQuery.join(',')}`,
      )
    : [];
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
