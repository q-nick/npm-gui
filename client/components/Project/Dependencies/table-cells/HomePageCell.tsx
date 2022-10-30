import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { Link } from '../../../../ui/Button/Link';
import { normalizeRepositoryLink } from '../../../../utils';

export const HomePageCell = ({
  homepage,
  repository,
}: Pick<DependencyInstalledExtras, 'homepage' | 'repository'>): ReactNode => {
  if (
    !homepage ||
    (repository &&
      normalizeRepositoryLink(homepage) !== normalizeRepositoryLink(repository))
  ) {
    return null;
  }

  return (
    <Link
      href={homepage}
      icon="home"
      target="_blank"
      title="Go to package home page"
    />
  );
};
