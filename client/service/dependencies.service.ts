import type { Basic, Manager, Type } from '../../server/types/dependency.types';
import { xCacheId } from '../xcache';
import { fetchJSON, getBasePathFor } from './utils';

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

export const installGlobalDependencies = async (
  dependencies: Basic[],
): Promise<void> => {
  return fetchJSON(`${getBasePathFor('global')}`, {
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

export const deleteGlobalDependencies = async (
  dependencies: Basic[],
): Promise<void> => {
  return fetchJSON(`${getBasePathFor('global')}`, {
    method: 'DELETE',
    body: JSON.stringify(dependencies),
    headers: { 'x-cache-id': xCacheId },
  });
};
