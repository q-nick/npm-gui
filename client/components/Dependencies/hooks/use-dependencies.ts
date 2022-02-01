/* eslint-disable max-lines-per-function */
import { useCallback, useContext, useEffect, useMemo } from 'react';

import type {
  Basic,
  Entire,
  Manager,
  Type,
} from '../../../../server/types/dependency.types';
import { StoreContext } from '../../../app/StoreContext';
import { ZERO } from '../../../utils';
import { xCacheId } from '../../../xcache';
import { ScheduleContext } from '../../Schedule/ScheduleContext';

const getBasePathFor = (projectPath: string): string => {
  if (projectPath !== 'global') {
    return `/api/project/${projectPath}/dependencies`;
  }

  return 'api/global/dependencies';
};

export interface Hook {
  dependencies?: Entire[];
  dependenciesProcessing: string[];
  onInstallNewDependency: (dependency: Basic, type: Type) => void;
  onInstallAllDependencies: (manager?: Manager) => void;
  onUpdateDependencies: (dependencies: Basic[]) => void;
  onDeleteDependency: (dependency: Basic) => void;
}

export const useDependencies = (projectPath: string): Hook => {
  const { addToApiSchedule } = useContext(ScheduleContext);
  const { projects, setProjectDependencies, updateProjectDepsProcessing } =
    useContext(StoreContext);

  const project = projects[projectPath];
  const dependencies = useMemo(
    () => (project ? project.dependencies : []),
    [project],
  );
  const dependenciesProcessing = useMemo(
    () => (project ? project.dependenciesProcessing : []),
    [project],
  );

  // Fetch function
  const fetchDependencies = useCallback(
    (instantSchedule?: boolean) => {
      addToApiSchedule({
        instantSchedule,
        projectPath,
        description: 'fetching dependencies',
        executeMe: async () => {
          const responseSimple = await fetch(
            `${getBasePathFor(projectPath)}/simple`,
            { headers: { 'x-cache-id': xCacheId } },
          );
          const simpleData = (await responseSimple.json()) as Entire[];
          setProjectDependencies(projectPath, simpleData);

          updateProjectDepsProcessing(
            projectPath,
            simpleData.map((d) => d.name),
            true,
          );

          const responseFull = await fetch(
            `${getBasePathFor(projectPath)}/full`,
            { headers: { 'x-cache-id': xCacheId } },
          );
          const fullData = (await responseFull.json()) as Entire[];
          if (Array.isArray(fullData)) {
            setProjectDependencies(projectPath, fullData);
          }
          updateProjectDepsProcessing(
            projectPath,
            simpleData.map((d) => d.name),
            false,
          );
        },
      });
    },
    [
      setProjectDependencies,
      updateProjectDepsProcessing,
      addToApiSchedule,
      projectPath,
    ],
  );

  // Add new dependency
  const onInstallNewDependency = useCallback<Hook['onInstallNewDependency']>(
    (dependency, type) => {
      updateProjectDepsProcessing(projectPath, [dependency.name], true);
      addToApiSchedule({
        projectPath,
        description: `installing ${dependency.name} as ${type}`,
        executeMe: async () => {
          updateProjectDepsProcessing(projectPath, [dependency.name], true);
          await fetch(`${getBasePathFor(projectPath)}/${type}`, {
            method: 'POST',
            body: JSON.stringify([dependency]),
            headers: { 'x-cache-id': xCacheId },
          });
          fetchDependencies();
        },
      });
    },
    [
      addToApiSchedule,
      fetchDependencies,
      updateProjectDepsProcessing,
      projectPath,
    ],
  );

  // Delete dependency
  const onDeleteDependency = useCallback<Hook['onDeleteDependency']>(
    (dependency) => {
      updateProjectDepsProcessing(projectPath, [dependency.name], true);
      addToApiSchedule({
        projectPath,
        description: `deleting ${dependency.name} as ${dependency.type}`,
        executeMe: async () => {
          updateProjectDepsProcessing(projectPath, [dependency.name], true);

          await fetch(
            `${getBasePathFor(projectPath)}/${dependency.type}/${
              dependency.name
            }`,
            { method: 'DELETE', headers: { 'x-cache-id': xCacheId } },
          );
          fetchDependencies();
        },
      });
    },
    [
      addToApiSchedule,
      projectPath,
      fetchDependencies,
      updateProjectDepsProcessing,
    ],
  );

  // Install all dependencies
  const onInstallAllDependencies = useCallback<
    Hook['onInstallAllDependencies']
  >(
    (manager) => {
      if (!dependencies) {
        return;
      }
      updateProjectDepsProcessing(
        projectPath,
        dependencies.map((d) => d.name),
        true,
      );
      addToApiSchedule({
        projectPath,
        description: `${manager ?? ''} installing all`,
        executeMe: async () => {
          updateProjectDepsProcessing(
            projectPath,
            dependencies.map((d) => d.name),
            true,
          );
          await fetch(
            `${getBasePathFor(projectPath)}/install${
              manager ? `/${manager}` : ''
            }`,
            { method: 'POST', headers: { 'x-cache-id': xCacheId } },
          );
          fetchDependencies();
        },
      });
    },
    [
      addToApiSchedule,
      projectPath,
      dependencies,
      fetchDependencies,
      updateProjectDepsProcessing,
    ],
  );

  // Install specific dependencies versions
  const onUpdateDependencies = useCallback<Hook['onUpdateDependencies']>(
    (dependenciesToUpdate) => {
      if (dependenciesToUpdate.length === ZERO) {
        return;
      }
      updateProjectDepsProcessing(
        projectPath,
        dependenciesToUpdate.map((d) => d.name),
        true,
      );

      const dependenciesToUpdateDevelopment = dependenciesToUpdate.filter(
        (d) => d.type === 'dev',
      );
      const dependenciesToUpdateProduction = dependenciesToUpdate.filter(
        (d) => d.type === 'prod',
      );

      addToApiSchedule({
        projectPath,
        description: 'updating dependencies',
        executeMe: async () => {
          updateProjectDepsProcessing(
            projectPath,
            dependenciesToUpdate.map((d) => d.name),
            true,
          );

          await fetch(`${getBasePathFor(projectPath)}/dev`, {
            method: 'POST',
            body: JSON.stringify(dependenciesToUpdateDevelopment),
            headers: { 'x-cache-id': xCacheId },
          });
          await fetch(`${getBasePathFor(projectPath)}/prod`, {
            method: 'POST',
            body: JSON.stringify(dependenciesToUpdateProduction),
            headers: { 'x-cache-id': xCacheId },
          });

          fetchDependencies();
        },
      });
    },
    [
      addToApiSchedule,
      updateProjectDepsProcessing,
      projectPath,
      fetchDependencies,
    ],
  );

  // Inital fetch
  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);

  return {
    dependencies,
    dependenciesProcessing,
    onInstallNewDependency,
    onInstallAllDependencies,
    onDeleteDependency,
    onUpdateDependencies,
  };
};
