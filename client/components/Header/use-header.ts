import { useHistory } from 'react-router-dom';

import { useProjectsStore } from '../../app/ContextStore';
import { useProjectPath } from '../../hooks/use-project-path';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useHeader = () => {
  const projectPathEncoded = useProjectPath();

  const { projects, dispatch } = useProjectsStore();

  const history = useHistory();

  const handleRemoveProject = (projectPathToRemove: string): void => {
    if (projectPathToRemove === projectPathEncoded) {
      history.push(`/`);
    }
    dispatch({ action: 'removeProject', projectPath: projectPathToRemove });
  };

  return {
    projectPathEncoded,
    handleRemoveProject,
    projects,
  };
};
