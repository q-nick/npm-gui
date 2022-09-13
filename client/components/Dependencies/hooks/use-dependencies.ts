/* eslint-disable max-lines-per-function */
import { useCallback, useContext, useEffect, useMemo } from 'react';

import type {
  Basic,
  Entire,
  Manager,
  Type,
} from '../../../../server/types/dependency.types';
import { ContextStore } from '../../../app/ContextStore';
import { ZERO } from '../../../utils';
import { xCacheId } from '../../../xcache';
import { TaskQueueContext } from '../../TaskQueue/TaskQueueContext';

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
  const { dispatch: taskQueueDispatch } = useContext(TaskQueueContext);
  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

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
  const fetchDependencies = useCallback(() => {
    taskQueueDispatch({
      type: 'addTask',
      task: {
        projectPath,
        description: 'fetching dependencies',
        executeMe: async () => {
          const responseFast = await fetch(
            `${getBasePathFor(projectPath)}/simple`,
            { headers: { 'x-cache-id': xCacheId } },
          );
          const fastData = (await responseFast.json()) as Entire[];

          dispatch({
            type: 'setProjectDependencies',
            projectPath,
            dependencies: fastData,
          });

          dispatch({
            type: 'setProjectDependenciesProcessing',
            projectPath,
            dependenciesToUpdate: fastData.map((d) => d.name),
            value: true,
          });

          const responseFull = await fetch(
            `${getBasePathFor(projectPath)}/full`,
            { headers: { 'x-cache-id': xCacheId } },
          );
          const fullData = (await responseFull.json()) as Entire[];

          if (Array.isArray(fullData)) {
            dispatch({
              type: 'setProjectDependencies',
              projectPath,
              dependencies: fullData,
            });
          }

          dispatch({
            type: 'setProjectDependenciesProcessing',
            projectPath,
            dependenciesToUpdate: fastData.map((d) => d.name),
            value: false,
          });
        },
      },
    });
  }, [dispatch, projectPath, taskQueueDispatch]);

  // Add new dependency
  const onInstallNewDependency = useCallback<Hook['onInstallNewDependency']>(
    (dependency, type) => {
      taskQueueDispatch({
        type: 'addTask',
        task: {
          projectPath,
          description: `installing ${dependency.name} as ${type}`,
          dependencies: [dependency.name],
          skipFinalDependencies: true,
          executeMe: async () => {
            await fetch(`${getBasePathFor(projectPath)}/${type}`, {
              method: 'POST',
              body: JSON.stringify([dependency]),
              headers: { 'x-cache-id': xCacheId },
            });

            fetchDependencies();
          },
        },
      });
    },
    [fetchDependencies, projectPath, taskQueueDispatch],
  );

  // Delete dependency
  const onDeleteDependency = useCallback<Hook['onDeleteDependency']>(
    (dependency) => {
      taskQueueDispatch({
        type: 'addTask',
        task: {
          projectPath,
          description: `deleting ${dependency.name} as ${dependency.type}`,
          dependencies: [dependency.name],
          skipFinalDependencies: true,
          executeMe: async () => {
            await fetch(
              `${getBasePathFor(projectPath)}/${dependency.type}/${
                dependency.name
              }`,
              { method: 'DELETE', headers: { 'x-cache-id': xCacheId } },
            );
            fetchDependencies();
          },
        },
      });
    },
    [fetchDependencies, projectPath, taskQueueDispatch],
  );

  // Install all dependencies
  const onInstallAllDependencies = useCallback<
    Hook['onInstallAllDependencies']
  >(
    (manager) => {
      if (!dependencies) {
        return;
      }

      taskQueueDispatch({
        type: 'addTask',
        task: {
          projectPath,
          description: `${manager ?? ''} installing all`,
          dependencies: dependencies.map((d) => d.name),
          executeMe: async () => {
            await fetch(
              `${getBasePathFor(projectPath)}/install${
                manager ? `/${manager}` : ''
              }`,
              { method: 'POST', headers: { 'x-cache-id': xCacheId } },
            );
            fetchDependencies();
          },
        },
      });
    },
    [dependencies, fetchDependencies, projectPath, taskQueueDispatch],
  );

  // Install specific dependencies versions
  const onUpdateDependencies = useCallback<Hook['onUpdateDependencies']>(
    (dependenciesToUpdate) => {
      if (dependenciesToUpdate.length === ZERO) {
        return;
      }

      const dependenciesToUpdateDevelopment = dependenciesToUpdate.filter(
        (d) => d.type === 'dev',
      );
      const dependenciesToUpdateProduction = dependenciesToUpdate.filter(
        (d) => d.type === 'prod',
      );

      taskQueueDispatch({
        type: 'addTask',
        task: {
          projectPath,
          description: 'updating dependencies',
          dependencies: dependenciesToUpdate.map((d) => d.name),
          skipFinalDependencies: true,
          executeMe: async () => {
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
        },
      });
    },
    [fetchDependencies, projectPath, taskQueueDispatch],
  );

  // Inital fetch
  useEffect(() => {
    fetchDependencies();
  }, [fetchDependencies]);
  console.log(projects);
  return {
    dependencies,
    dependenciesProcessing,
    onInstallNewDependency,
    onInstallAllDependencies,
    onDeleteDependency,
    onUpdateDependencies,
  };
};
