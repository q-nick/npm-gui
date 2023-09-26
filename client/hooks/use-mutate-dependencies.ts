/* eslint-disable max-statements */
import { useMutation } from '@tanstack/react-query';

import { useProjectsJobs, useProjectStore } from '../app/ContextStore';
import {
  deleteDependencies,
  deleteGlobalDependencies,
  installDependencies,
  installGlobalDependencies,
} from '../service/dependencies.service';

export const useMutateDependencies = (projectPath: string) => {
  const { project, dispatch } = useProjectStore(projectPath);
  const { startJob, successJob } = useProjectsJobs(projectPath);

  return useMutation([projectPath, 'sync-dependencies'], async () => {
    if (!project) {
      return;
    }

    const id = startJob('Synchronizing dependencies changes');

    const { dependenciesMutate } = project;

    // eslint-disable-next-line unicorn/consistent-destructuring
    if (project.path === 'global') {
      // delete global
      const delDependencies = Object.entries(dependenciesMutate || {})
        .filter(([_, value]) => value.type === 'global' && value.delete)
        .map(([name]) => ({ name }));
      if (delDependencies.length > 0) {
        await deleteGlobalDependencies(delDependencies);
      }

      // install global
      const dependencies = Object.entries(dependenciesMutate || {})
        .filter(
          ([_, value]) => value.type === 'global' && value.required !== null,
        )
        .map(([name, value]) => ({
          name,
          version: value.required || undefined,
        }));
      if (dependencies.length > 0) {
        await installGlobalDependencies(dependencies);
      }
    } else {
      // delete dev
      const delDevelopmentDependencies = Object.entries(
        dependenciesMutate || {},
      )
        .filter(([_, value]) => value.type === 'dev' && value.delete)
        .map(([name]) => ({ name }));
      if (delDevelopmentDependencies.length > 0) {
        await deleteDependencies(
          projectPath,
          'dev',
          delDevelopmentDependencies,
        );
      }

      // delete prod
      const delProductionDependencies = Object.entries(dependenciesMutate || {})
        .filter(([_, value]) => value.type === 'prod' && value.delete)
        .map(([name]) => ({ name }));
      if (delProductionDependencies.length > 0) {
        await deleteDependencies(
          projectPath,
          'prod',
          delProductionDependencies,
        );
      }

      // install dev
      const devDependencies = Object.entries(dependenciesMutate || {})
        .filter(([_, value]) => value.type === 'dev' && value.required !== null)
        .map(([name, value]) => ({
          name,
          version: value.required || undefined,
        }));
      if (devDependencies.length > 0) {
        await installDependencies(projectPath, 'dev', devDependencies);
      }

      // install prod
      const dependencies = Object.entries(dependenciesMutate || {})
        .filter(([_, value]) => value.type === 'prod' && value.required)
        .map(([name, value]) => ({
          name,
          version: value.required || undefined,
        }));
      if (dependencies.length > 0) {
        await installDependencies(projectPath, 'prod', dependencies);
      }
    }

    dispatch({ action: 'mutateProjectDependencyReset', projectPath });

    successJob(id);
  });
};
