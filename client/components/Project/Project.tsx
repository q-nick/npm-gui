import type { VFC } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';

import { ContextStore } from '../../app/ContextStore';
import { useFastDependencies } from '../../hooks/use-fast-dependencies';
import { useProjectPath } from '../../hooks/use-project-path';
import { Loader } from '../../ui/Loader';
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

const WrapperCenter = styled.div`
  display: flex;
  flex: 1;
  padding: 7px 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const Text = styled.p`
  text-align: center;
  max-width: 200px;
`;

export const Project: VFC = () => {
  const projectPath = useProjectPath();
  const { dispatch } = useContext(ContextStore);
  const { projectExists } = useProject(projectPath);

  // request for package.json
  const { isError, isFetched } = useFastDependencies(projectPath, () => {
    if (!projectExists) {
      dispatch({ action: 'addProject', projectPath });
    }
  });

  // invalid project
  if (isError) {
    return (
      <WrapperCenter>
        <b>Invalid project</b>({window.atob(projectPath)})
        <Text>
          Use <b>Open</b> button in top right corner to navigate to project with
          &nbsp;
          <b>package.json</b>
        </Text>
      </WrapperCenter>
    );
  }

  // loading
  if (!isFetched || !projectExists) {
    return (
      <WrapperCenter>
        <Loader />
        Verifying
      </WrapperCenter>
    );
  }

  // all good
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
