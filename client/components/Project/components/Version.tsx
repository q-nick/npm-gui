import type { VFC } from 'react';
import styled from 'styled-components';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { Button } from '../../../ui/Button/Button';
import { getNormalizedRequiredVersion } from '../../../utils';
import { Loader } from '../../Loader';

export const Missing = styled.span`
  color: #d9534f;
`;

interface Props {
  dependency: DependencyInstalledExtras;
  isProcessing: boolean;
  onInstall: (version: string) => void;
  version: string | null | undefined;
  isInstalled?: true;
}

export const Version: VFC<Props> = ({
  dependency,
  isProcessing,
  version,
  onInstall,
  isInstalled,
}) => {
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
      disabled={isProcessing}
      icon="cloud-download"
      onClick={(): void => {
        onInstall(version);
      }}
      title={`Install ${version} version of ${dependency.name}`}
      variant="success"
    >
      {version}
    </Button>
  );
};
