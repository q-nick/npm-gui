import React from 'react';
import { Task } from '../ScheduleContext';
import { Button, Props as ButtonProps } from '../../../ui/Button/Button';

interface Props {
  task: Task;
  onClick: () => void;
}

const mapStatusToButtonVariant: Record<Task['status'], ButtonProps['variant']> = {
  WAITING: 'info',
  RUNNING: 'success',
  ERROR: 'danger',
  SUCCESS: 'dark',
};

export function TaskElement({ task, onClick }: Props): JSX.Element {
  return (
    <Button variant={mapStatusToButtonVariant[task.status]} onClick={onClick}>
      {task.description}
      {' '}
      {task.status}
    </Button>
  );
}
