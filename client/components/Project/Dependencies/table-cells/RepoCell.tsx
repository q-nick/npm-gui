import type { ReactNode } from 'react';

import type { DependencyInstalledExtras } from '../../../../../server/types/dependency.types';
import { Link } from '../../../../ui/Button/Link';
import { normalizeRepositoryLink } from '../../../../utils';

export const RepoCell = ({
  repository,
}: Pick<DependencyInstalledExtras, 'repository'>): ReactNode => {
  if (!repository) {
    return null;
  }

  return (
    <Link
      href={normalizeRepositoryLink(repository)}
      icon="fork"
      target="_blank"
      title="Go to code repository"
    />
  );
};
