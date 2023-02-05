import type { FC } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../../app/ContextStore';
import { useProjectPath } from '../../../../../hooks/use-project-path';
import { Button } from '../../../../../ui/Button/Button';

interface Props {
  dependency: DependencyInstalledExtras;
}

const Line = styled.hr`
  position: absolute;
  pointer-events: none;
  width: calc(100vw - 110px);
  left: 10px;
  margin: 0;
  margin-top: 10px;
`;

export const TableActions: FC<Props> = ({ dependency }) => {
  const projectPath = useProjectPath();
  const { dispatch, project } = useProjectStore(projectPath);

  const markedForDeletion =
    !!project?.dependenciesMutate[dependency.name]?.delete;

  return (
    <>
      {markedForDeletion && <Line />}
      <Button
        disabled={project?.isBusy}
        icon={markedForDeletion ? 'x' : 'trash'}
        onClick={(): void =>
          markedForDeletion
            ? dispatch({
                action: 'mutateProjectDependencyCancel',
                projectPath,
                name: dependency.name,
              })
            : dispatch({
                action: 'mutateProjectDependency',
                projectPath,
                name: dependency.name,
                required: null,
                delete: true,
                type: dependency.type,
              })
        }
        title={
          markedForDeletion ? 'Cancel deletion' : 'Remove package from project'
        }
        variant="danger"
      />
    </>
  );
};
