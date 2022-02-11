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

export const TaskQueue: VFC = () => {
  const {
    state: { queue },
    dispatch,
  } = useContext(TaskQueueContext);

  return (
    <TaskQueueWrapper>
      {queue.map((task) => (
        <TaskElement
          key={task.id}
          onClick={(): void => {
            dispatch({ type: 'removeTask', task });
          }}
          task={task}
        />
      ))}
    </TaskQueueWrapper>
  );
};
