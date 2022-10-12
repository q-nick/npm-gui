import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import { ContextStore } from '../../app/ContextStore';
import { useProjectPath } from '../use-project-path';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useHeader = () => {
  const projectPathEncoded = useProjectPath();

  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

  const history = useHistory();

  const handleRemoveProject = (projectPathToRemove: string): void => {
    if (projectPathToRemove === projectPathEncoded) {
      history.push(`/`);
    }
    dispatch({ type: 'removeProject', projectPath: projectPathToRemove });
  };

  return {
    projectPathEncoded,
    handleRemoveProject,
    projects,
  };
};
