/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@tanstack/react-query';

import type { Manager } from '../../server/types/dependency.types';
import { useProjectsJobs, useProjectStore } from '../app/ContextStore';
import { reinstall } from '../service/dependencies.service';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useMutateReinstall = (projectPath: string) => {
  const { project } = useProjectStore(projectPath);
  const { startJob, successJob } = useProjectsJobs(projectPath);

  return useMutation([projectPath, 'reinstall'], async (manager?: Manager) => {
    if (!project) {
      return;
    }

    const id = startJob(
      `Reinstalling project dependencies ${
        manager ? ` using: ${manager}` : ''
      }`,
    );

    await reinstall(projectPath, manager);

    successJob(id);
  });
};
