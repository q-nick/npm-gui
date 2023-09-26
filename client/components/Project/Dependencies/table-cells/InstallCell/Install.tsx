import type { FC } from 'react';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../../app/ContextStore';
import { useProjectPath } from '../../../../../hooks/use-project-path';
import { Button } from '../../../../../ui/Button/Button';

interface Props {
  readonly dependency: DependencyInstalledExtras;
}

export const Install: FC<Props> = ({ dependency }) => {
  const projectPath = useProjectPath();
  const { project, dispatch } = useProjectStore(projectPath);

  const v = project?.dependenciesMutate[dependency.name]?.required;

  return (
    <span>
      {v}{' '}
      {v ? (
        <Button
          disabled={project.isBusy}
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
      ) : null}
    </span>
  );
};
