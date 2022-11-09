/* eslint-disable @typescript-eslint/no-unused-vars */
import type { VFC } from 'react';

import { useProjectStore } from '../../../app/ContextStore';
import { useIsProjectBusy } from '../../../hooks/use-is-project-busy';
import { useMutateDependencies } from '../../../hooks/use-mutate-dependencies';
import { useProjectPath } from '../../../hooks/use-project-path';
import { Button } from '../../../ui/Button/Button';

export const InstallHeader: VFC = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);
  const isProjectBusy = useIsProjectBusy(projectPath);
  const syncDependenciesMutation = useMutateDependencies(projectPath);

  const hasChanges = Object.values(project?.dependenciesMutate || {}).some(
    (value) => value?.required || value?.delete,
  );

  return (
    <Button
      disabled={!hasChanges || isProjectBusy}
      icon="caret-right"
      onClick={(): void => syncDependenciesMutation.mutate()}
      title="Install project depednencies"
      variant="success"
    >
      install
    </Button>
  );
};
