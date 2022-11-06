import type { VFC } from 'react';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { useCurrentProjectStore } from '../../../../../app/ContextStore';
import { useIsProjectBusy } from '../../../../../hooks/use-is-project-busy';
import { useProjectPath } from '../../../../../hooks/use-project-path';
import { Button } from '../../../../../ui/Button/Button';

interface Props {
  dependency: DependencyInstalledExtras;
}

export const Install: VFC<Props> = ({ dependency }) => {
  const projectPath = useProjectPath();
  const isProjectBusy = useIsProjectBusy(projectPath);
  const { project, dispatch } = useCurrentProjectStore();

  const v = project?.dependenciesMutate[dependency.name]?.required;

  return (
    <span>
      {v}{' '}
      {v && (
        <Button
          disabled={isProjectBusy}
          icon="x"
          onClick={(): void =>
            dispatch({
              action: 'mutateProjectDependencyCancel',
              projectPath,
              name: dependency.name,
            })
          }
          title="Cancel change"
          variant="danger"
        />
      )}
    </span>
  );
};
