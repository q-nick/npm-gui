import type { VFC } from 'react';

import type { DependencyInstalledExtras } from '../../../../server/types/dependency.types';
import { useCurrentProjectStore } from '../../../app/ContextStore';

interface Props {
  dependency: DependencyInstalledExtras;
}

export const Install: VFC<Props> = ({ dependency }) => {
  const { project } = useCurrentProjectStore();

  return <span>{project?.dependenciesMutate[dependency.name]?.required}</span>;
};
