import { useState } from 'react';
import styled from 'styled-components';
import type { Task } from '../ScheduleContext';
import type { Props as ButtonProps } from '../../../ui/Button/Button';
import { Button } from '../../../ui/Button/Button';
import { Modal } from '../../../ui/Modal/Modal';

const CloseButton = styled(Button)`
  margin-right: 15px;
  margin-left: -3px;
`;
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
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={(): void => { setDetailsOpen(true); }}
        variant={mapStatusToButtonVariant[task.status]}
      >
        {task.description}
        &nbsp;
        {task.status}
      </Button>

      <CloseButton
        disabled={task.status === 'RUNNING'}
        icon="x"
        onClick={onClick}
        variant={mapStatusToButtonVariant[task.status]}
      />

      {detailsOpen && (
        <Modal onClose={(): void => { setDetailsOpen(false); }}>
          <pre>{JSON.stringify(task.stdout, null, 2)}</pre>
        </Modal>
      )}
    </>
  );
}
