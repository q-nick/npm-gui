/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMutation } from '@tanstack/react-query';

import { useProjectStore } from '../../../app/ContextStore';
import {
  deleteDependencies,
  installDependencies,
} from '../../../service/dependencies.service';
import { useProjectPath } from '../../use-project-path';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useMutateDependencies = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);

  return useMutation([projectPath, 'sync-dependencies'], async () => {
    if (!project) {
      return;
    }

    const { dependenciesMutate } = project;

    // delete dev
    const delDevelopmentDependencies = Object.entries(dependenciesMutate || {})
      .filter(([_, value]) => value.type === 'dev' && value.delete)
      .map(([name]) => ({ name }));
    await deleteDependencies(projectPath, 'dev', delDevelopmentDependencies);

    // delete prod
    const delProductionDependencies = Object.entries(dependenciesMutate || {})
      .filter(([_, value]) => value.type === 'prod' && value.delete)
      .map(([name]) => ({ name }));
    await deleteDependencies(projectPath, 'prod', delProductionDependencies);

    // dev
    const devDependencies = Object.entries(dependenciesMutate || {})
      .filter(([_, value]) => value.type === 'dev' && value.required !== null)
      .map(([name, value]) => ({ name, version: value.required }));

    await installDependencies(projectPath, 'dev', devDependencies);

    // prod
    const dependencies = Object.entries(dependenciesMutate || {})
      .filter(([_, value]) => value.type === 'prod' && value.required)
      .map(([name, value]) => ({ name, version: value.required }));

    await installDependencies(projectPath, 'prod', dependencies);
  });
};
