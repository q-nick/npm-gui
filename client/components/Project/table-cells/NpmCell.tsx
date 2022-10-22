import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { Link } from '../../../ui/Button/Link';

export const NpmCell = ({
  name,
  manager,
}: DependencyInstalledExtras): ReactNode => {
  return (
    <Link
      href={`https://www.npmjs.com/package/${name}`}
      target="_blank"
      title="Open NPM site with package details"
      variant="danger"
    >
      {manager}
    </Link>
  );
};
