/* eslint-disable @typescript-eslint/no-explicit-any */
import type { VFC } from 'react';
import styled from 'styled-components';

import { TaskElement } from './Task';

const TaskQueueWrapper = styled.div`
  background: #3e3f3a;
  padding: 5px 15px;
  display: flex;
  flex-wrap: wrap;
`;

interface Props {
  queueId: string;
}

export const TaskQueue: VFC<Props> = ({ queueId }) => {
  const queue: Record<string, any> = {};

  return (
    <TaskQueueWrapper>
      {queue[queueId]?.map((task: any) => (
        <TaskElement
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
