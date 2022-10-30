/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VFC } from 'react';
import styled from 'styled-components';

import { useMutateDependencies } from '../../../hooks/use-mutate-dependencies';
import { Job } from './Job';

const TaskQueueWrapper = styled.div`
  background: #3e3f3a;
  padding: 5px 15px;
  display: flex;
  flex-wrap: wrap;
`;

interface Props {
  projectPath: string;
}

export const ProjectJobs: VFC<Props> = ({ projectPath }) => {
  const queue: Record<string, any> = {};

  // const queryClient = useQueryClient({});
  // eslint-disable-next-line no-console
  console.log(projectPath);

  // TODO mutation
  useMutateDependencies();
  return (
    <TaskQueueWrapper>
      {queue['queueId']?.map((task: any) => (
        <Job
          key={task.id}
          onClick={(): void => {
            // dispatch({ type: 'removeTask', task, queueId });
          }}
          task={task}
        />
      ))}
    </TaskQueueWrapper>
  );
};
