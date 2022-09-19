import type { VFC } from 'react';
import { useContext, useEffect } from 'react';
import styled from 'styled-components';

import { ContextStore } from '../app/ContextStore';
import { Project } from './Project/Project';
import { TaskQueue } from './TaskQueue/TaskQueue';
import { useProjectPath } from './use-project-path';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 15px;
  flex-direction: column;
  overflow: hidden;
`;

export const Main: VFC = () => {
  const projectPath = useProjectPath();

  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

  const projectExists = projects.includes(projectPath);

  useEffect(() => {
    if (!projectExists) {
      dispatch({ type: 'addProject', projectPath });
    }
  }, [projectPath, projectExists, dispatch]);

  if (!projectExists) {
    return null;
  }

  return (
    <>
      <Wrapper>
        <Project projectPath={projectPath} />
      </Wrapper>
      <TaskQueue queueId={projectPath} />
    </>
  );
};
