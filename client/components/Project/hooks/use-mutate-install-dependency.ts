/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@tanstack/react-query';

import type { Basic } from '../../../../server/types/dependency.types';
import { useProjectStore } from '../../../app/ContextStore';
import { installDependencies } from '../../../service/dependencies.service';
import { useProjectPath } from '../../use-project-path';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useMutateInstallDependency = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);

  return useMutation(
    [projectPath, 'install-dependency'],
    async (dependency: Basic) => {
      if (!project) {
        return;
      }

      if (dependency.type) {
        await installDependencies(projectPath, dependency.type, [dependency]);
      }
    },
  );
};
