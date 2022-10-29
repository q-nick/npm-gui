/* eslint-disable react/destructuring-assignment */
import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { TableVersion } from '../components/TableVersion';

export const CompatibleCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  return <TableVersion dependency={dependency} version={dependency.wanted} />;
};
