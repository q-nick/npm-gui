import type { VFC } from 'react';

import { useProjectStore } from '../../../app/ContextStore';
import { useMutateDependencies } from '../../../hooks/use-mutate-dependencies';
import { useProjectPath } from '../../../hooks/use-project-path';
import { Button } from '../../../ui/Button/Button';

export const InstallHeader: VFC = () => {
  const projectPath = useProjectPath();
  const { project } = useProjectStore(projectPath);
  const syncDependenciesMutation = useMutateDependencies(projectPath);

  const hasChanges = Object.values(project?.dependenciesMutate || {}).some(
    (value) => value?.required || value?.delete,
  );

  return (
    <Button
      disabled={!hasChanges || project?.isBusy}
      icon="caret-right"
      onClick={(): void => syncDependenciesMutation.mutate()}
      title="Install project depednencies"
      variant="success"
    >
      install
    </Button>
  );
};
