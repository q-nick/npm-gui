import { useContext } from 'react';
import styled from 'styled-components';
import { ScheduleContext } from './ScheduleContext';
import { TaskElement } from './components/Task';

const ScheduleWrapper = styled.div`
  background: #3e3f3a;
  padding: 5px 15px;
  display: flex;
  flex-wrap: wrap;
`;

export function Schedule(): JSX.Element {
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
}
