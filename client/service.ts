import type {
  BundleScore,
  BundleSize,
  DependencyInstalled,
  Manager,
} from '../server/types/dependency.types';
import { xCacheId } from './xcache';

export const getAvailableManagers = async (): Promise<
  Record<Manager, boolean>
> => {
  const response = await fetch(`/api/available-managers`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const getBasePathFor = (projectPath: string): string => {
  if (projectPath !== 'global') {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
};

export const getProjectDependenciesFast = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  const response = await fetch(`${getBasePathFor(projectPath)}/simple`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getProjectDependenciesFull = async (
  projectPath: string,
): Promise<DependencyInstalled[]> => {
  const response = await fetch(`${getBasePathFor(projectPath)}/full`, {
    headers: { 'x-cache-id': xCacheId },
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getDependencyScore = async (
  dependencyName: string,
): Promise<BundleScore> => {
  const response = await fetch(`api/score/${dependencyName}`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};

export const getDependencySize = async (
  dependencyName: string,
  installedVersion?: string | null,
): Promise<BundleSize> => {
  const response = await fetch(
    `api/bundle-size/${dependencyName}/${installedVersion}`,
  );

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
