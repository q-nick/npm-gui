import type { ReactNode } from 'react';

import type { Manager } from '../../../../server/types/dependency.types';
import { Link } from '../../../ui/Button/Link';

export const NpmCell = ({
  name,
  manager = 'npm',
}: {
  name: string;
  manager?: Manager;
}): ReactNode => {
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
