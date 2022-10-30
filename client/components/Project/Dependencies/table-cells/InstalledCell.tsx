/* eslint-disable react/destructuring-assignment */
import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { TableVersion } from './VersionCells/TableVersion';

export const InstalledCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  return (
    <TableVersion
      dependency={dependency}
      isInstalled
      version={dependency.installed}
    />
  );
};
