import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { Link } from '../../../../ui/Button/Link';

const ONE_KB = 1024;
const DIGITS = 2;

export const SizeCell = ({
  name,
  installed,
  size,
}: DependencyInstalledExtras): ReactNode => {
  if (typeof size !== 'number') {
    return null;
  }

  return (
    <Link
      href={`https://bundlephobia.com/package/${name}@${installed}`}
      target="_blank"
      title="Visit bundlephobia package details"
    >
      {`${Number.parseFloat(`${size / ONE_KB}`).toFixed(DIGITS)}kB`}
    </Link>
  );
};
