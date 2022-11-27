import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';

import { ContextStore } from '../../app/ContextStore';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useProject = (projectPath: string) => {
  const isMutating = useIsMutating([projectPath]) > 0;
  const isFetching = useIsFetching([projectPath]) > 0;

  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

  const projectExists = projects.some(
    (project) => project.path === projectPath,
  );

  useEffect(() => {
    if (!projectExists) {
      dispatch({ action: 'addProject', projectPath });
    }
  }, [projectPath, projectExists, dispatch]);

  useEffect(() => {
    dispatch({
      action: 'busyProject',
      projectPath,
      isBusy: isMutating || isFetching,
    });
  }, [dispatch, isFetching, isMutating, projectPath]);

  return { projectExists };
};
