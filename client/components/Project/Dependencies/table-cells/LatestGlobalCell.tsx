/* eslint-disable react/destructuring-assignment */
import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { TableVersion } from './VersionCells/TableVersion';

export const LatestGlobalCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  const latestVersion =
    dependency.versions &&
    [...dependency.versions]
      .reverse()
      .find((version) => /^\d+\.\d+\.\d+$/.test(version));

  return <TableVersion dependency={dependency} version={latestVersion} />;
};
