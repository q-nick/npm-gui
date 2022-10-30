/* eslint-disable react/destructuring-assignment */
import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../../server/types/dependency.types';
import { TableActions } from './TableActions';

export const ActionsCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  return <TableActions dependency={dependency} />;
};
