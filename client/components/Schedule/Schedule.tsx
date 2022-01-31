import type { VFC } from 'react';
import { useContext } from 'react';
import styled from 'styled-components';

import { TaskElement } from './components/Task';
import { ScheduleContext } from './ScheduleContext';

const ScheduleWrapper = styled.div`
  background: #3e3f3a;
  padding: 5px 15px;
  display: flex;
  flex-wrap: wrap;
`;

export const Schedule: VFC = () => {
  const { schedule, removeTask } = useContext(ScheduleContext);

  return (
    <ScheduleWrapper>
      {schedule.map((task) => (
        <TaskElement
          key={task.id}
          onClick={(): void => {
            removeTask(task);
          }}
          task={task}
        />
      ))}
    </ScheduleWrapper>
  );
};
