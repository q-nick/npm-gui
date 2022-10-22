/* eslint-disable react/destructuring-assignment */
import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { Version } from '../components/Version';

export const CompatibleCell = (
  dependency: DependencyInstalledExtras,
): ReactNode => {
  return <Version dependency={dependency} version={dependency.wanted} />;
};
