import { useHistory } from 'react-router-dom';

import { useProjectsStore } from '../../app/ContextStore';
import { useProjectPath } from '../../hooks/use-project-path';

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
