/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VFC } from 'react';
import styled from 'styled-components';

import { useProjectsJobs, useProjectStore } from '../../../app/ContextStore';
import { JobItem } from './JobItem';

const TaskQueueWrapper = styled.div`
  background: #3e3f3a;
  padding: 5px 15px;
  display: flex;
`;

interface Props {
  projectPath: string;
}

export const ProjectJobs: VFC<Props> = ({ projectPath }) => {
  const { project } = useProjectStore(projectPath);
  const { removeJob } = useProjectsJobs(projectPath);

  return (
    <TaskQueueWrapper>
      {project?.jobs.map((job) => (
        <JobItem
          description={job.description}
          key={job.id}
          onRemove={(): void => removeJob(job.id)}
          status={job.status}
        />
      ))}
    </TaskQueueWrapper>
  );
};
