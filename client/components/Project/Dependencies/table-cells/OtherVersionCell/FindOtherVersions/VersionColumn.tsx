import type { FC } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../../../app/ContextStore';
import { useProjectPath } from '../../../../../../hooks/use-project-path';
import { Button } from '../../../../../../ui/Button/Button';

const Column = styled.div`
  text-align: left;
`;

const Row = styled.div`
  white-space: nowrap;
  margin-bottom: 10px;
`;

interface Props {
  selectedVersion?: string;
  versions: string[];
  onClick: () => void;
  onMouseEnter?: (version: string) => void;
  dependency: DependencyInstalledExtras;
}

export const VersionColumn: FC<Props> = ({
  versions,
  selectedVersion,
  onClick,
  onMouseEnter,
  dependency,
}) => {
  const projectPath = useProjectPath();
  const { dispatch } = useProjectStore(projectPath);

  return (
    <Column>
      {versions?.map((version) => (
        <Row key={version}>
          <Button
            icon="cloud-download"
            onClick={(): void => {
              dispatch({
                action: 'mutateProjectDependency',
                projectPath,
                name: dependency.name,
                required: version,
                type: dependency.type,
                delete: null,
              });
              onClick();
            }}
            onMouseEnter={
              onMouseEnter ? (): void => onMouseEnter(version) : undefined
            }
            title={`Install ${version}`}
            variant="success"
          >
            {version}
          </Button>
          {version === selectedVersion && <>&nbsp;=&gt;</>}
        </Row>
      ))}
    </Column>
  );
};
