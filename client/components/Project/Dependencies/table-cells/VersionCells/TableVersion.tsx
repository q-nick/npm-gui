import type { FC } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { useProjectStore } from '../../../../../app/ContextStore';
import { useProjectPath } from '../../../../../hooks/use-project-path';
import { Button } from '../../../../../ui/Button/Button';
import { Loader } from '../../../../../ui/Loader';
import { getNormalizedRequiredVersion } from '../../../../../utils';

const Missing = styled.span`
  color: #d9534f;
`;

interface Props {
  readonly dependency: DependencyInstalledExtras;
  readonly version: string | null | undefined;
  readonly isInstalled?: true;
}

export const TableVersion: FC<Props> = ({
  dependency,
  version,
  isInstalled,
}) => {
  const projectPath = useProjectPath();
  const { dispatch, project } = useProjectStore(projectPath);

  if (isInstalled) {
    if (version === undefined) {
      return <Loader />;
    }

    if (version === null) {
      return <Missing>missing</Missing>;
    }

    if (
      dependency.type === 'global' ||
      getNormalizedRequiredVersion(dependency.required) === version
    ) {
      return <span>{version}</span>;
    }
  } else if (version === null) {
    return <>-</>;
  }

  if (typeof version !== 'string') {
    return null;
  }

  return (
    <Button
      disabled={
        project?.dependenciesMutate[dependency.name]?.required === version ||
        project?.isBusy
      }
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
      }}
      title={`Install ${version} version of ${dependency.name}`}
      variant="success"
    >
      {version}
    </Button>
  );
};
