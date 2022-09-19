import type { VFC } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';

import { TaskElement } from './components/Task';
import { TaskQueueContext } from './TaskQueueContext';

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
  const {
    state: { queue },
    dispatch,
  } = useContext(TaskQueueContext);

  return (
    <TaskQueueWrapper>
      {queue[queueId]?.map((task) => (
        <TaskElement
          key={task.id}
          onClick={(): void => {
            dispatch({ type: 'removeTask', task, queueId });
          }}
          task={task}
        />
      ))}
    </TaskQueueWrapper>
  );
};
