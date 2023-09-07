/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@tanstack/react-query';

import type { Basic } from '../../server/types/dependency.types';
import { useProjectsJobs, useProjectStore } from '../app/ContextStore';
import { installDependencies } from '../service/dependencies.service';
import { useProjectPath } from './use-project-path';

export const useMutateInstallDependency = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);
  const { startJob, successJob } = useProjectsJobs(projectPath);

  return useMutation(
    [projectPath, 'install-dependency'],
    async (dependency: Basic) => {
      if (!project) {
        return;
      }

      const id = startJob(
        `Installing new project dependencies: ${dependency.name}`,
      );

      if (dependency.type) {
        await installDependencies(projectPath, dependency.type, [dependency]);
      }

      successJob(id);
    },
  );
};
