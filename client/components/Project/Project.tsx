import type { VFC } from 'react';
import styled from 'styled-components';

import { useProjectPath } from '../../hooks/use-project-path';
import { Dependencies } from './Dependencies/Dependencies';
import { ProjectJobs } from './ProjectJobs/ProjectJobs';
import { useProject } from './use-project';

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  padding: 7px 15px;
  flex-direction: column;
  overflow: hidden;
`;

export const Project: VFC = () => {
  const projectPath = useProjectPath();
  const { projectExists } = useProject(projectPath);

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
