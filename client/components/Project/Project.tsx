import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import type { VFC } from 'react';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { ContextStore } from '../../app/ContextStore';
import { useProjectPath } from '../../hooks/use-project-path';
import { Dependencies } from './Dependencies/Dependencies';
import { ProjectJobs } from './ProjectJobs/ProjectJobs';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 15px;
  flex-direction: column;
  overflow: hidden;
`;

export const Project: VFC = () => {
  const projectPath = useProjectPath();
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

  if (!projectExists) {
    return null;
  }

  return (
    <>
      <Wrapper>
        <Dependencies projectPath={projectPath} />
      </Wrapper>
      {/* TODO we need to show pending jobs and their execution time */}
      <ProjectJobs projectPath={projectPath} />
    </>
  );
};
