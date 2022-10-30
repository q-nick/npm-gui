import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';

export const TypeCell = ({ type }: DependencyInstalledExtras): ReactNode => {
  return type !== 'prod' ? type : '';
};
