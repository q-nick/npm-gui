/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@tanstack/react-query';
import type { VFC } from 'react';

import { useProjectStore } from '../../app/ContextStore';
import {
  deleteDependencies,
  installDependencies,
} from '../../service/dependencies.service';
import { Button } from '../../ui/Button/Button';
import { useProjectPath } from '../use-project-path';

export const InstallHeader: VFC = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);

  const syncDependenciesMutation = useMutation(
    [projectPath, 'sync-dependencies'],
    async () => {
      // delete dev
      const delDevelopmentDependencies = Object.entries(
        project?.dependenciesMutate || {},
      )
        .filter(([_, value]) => value.type === 'dev' && value.delete)
        .map(([name]) => ({ name }));
      await deleteDependencies(projectPath, 'dev', delDevelopmentDependencies);

      // delete prod
      const delProductionDependencies = Object.entries(
        project?.dependenciesMutate || {},
      )
        .filter(([_, value]) => value.type === 'prod' && value.delete)
        .map(([name]) => ({ name }));
      await deleteDependencies(projectPath, 'prod', delProductionDependencies);

      // dev
      const devDependencies = Object.entries(project?.dependenciesMutate || {})
        .filter(([_, value]) => value.type === 'dev' && value.required)
        .map(([name, value]) => ({ name, version: value.required }));

      await installDependencies(projectPath, 'dev', devDependencies);

      // prod
      const dependencies = Object.entries(project?.dependenciesMutate || {})
        .filter(([_, value]) => value.type === 'prod' && value.required)
        .map(([name, value]) => ({ name, version: value.required }));

      await installDependencies(projectPath, 'prod', dependencies);
    },
  );

  const hasChanges = Object.values(project?.dependenciesMutate || {}).some(
    (value) => value.required || value.delete,
  );

  return (
    <Button
      disabled={!hasChanges || syncDependenciesMutation.isLoading}
      icon="caret-right"
      onClick={(): void => syncDependenciesMutation.mutate()}
      title="Install project depednencies"
      variant="success"
    >
      install
    </Button>
  );
};
