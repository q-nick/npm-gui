import type { FC } from 'react';
import { useContext } from 'react';

// import styled from 'styled-components';
import { ContextStore } from '../../app/ContextStore';
import { useFastDependencies } from '../../hooks/use-fast-dependencies';
import { useProjectPath } from '../../hooks/use-project-path';
import { Loader } from '../../ui/Loader';
import { Dependencies } from './Dependencies/Dependencies';
import { ProjectJobs } from './ProjectJobs/ProjectJobs';
import { useProject } from './use-project';

// const Wrapper = styled.div`
//   display: flex;
//   flex: 1;
//   padding: 7px 15px;
//   flex-direction: column;
//   overflow: hidden;
// `;

// const WrapperCenter = styled.div`
//   display: flex;
//   flex: 1;
//   padding: 7px 15px;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   overflow: hidden;
// `;

// const Text = styled.p`
//   text-align: center;
//   max-width: 200px;
// `;

export const Project: FC = () => {
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
      <div className="flex p-3 items-center justify-center">
        <b>Invalid project</b>({window.atob(projectPath)})
        <p className="text-center max-w-xs">
          Use <b>Open</b> button in top right corner to navigate to project with
          &nbsp;
          <b>package.json</b>
        </p>
      </div>
    );
  }

  // loading
  if (!isFetched || !projectExists) {
    return (
      <div className="flex p-3 items-center justify-center">
        <Loader />
        Verifying
      </div>
    );
  }

  // all good
  return (
    <>
      <div className="flex flex-col flex-1 p-1 overflow-hidden">
        <Dependencies projectPath={projectPath} />
      </div>
      {/* TODO we need to show pending jobs and their execution time */}
      <ProjectJobs projectPath={projectPath} />
    </>
  );
};
