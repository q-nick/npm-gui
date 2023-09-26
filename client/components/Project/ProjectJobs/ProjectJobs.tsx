import type { FC } from 'react';
import styled from 'styled-components';

import { useProjectsJobs, useProjectStore } from '../../../app/ContextStore';
import { JobItem } from './JobItem';

const TaskQueueWrapper = styled.div`
  background: #3e3f3a;
  padding: 5px 15px;
  display: flex;
`;

interface Props {
  readonly projectPath: string;
}

export const ProjectJobs: FC<Props> = ({ projectPath }) => {
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
