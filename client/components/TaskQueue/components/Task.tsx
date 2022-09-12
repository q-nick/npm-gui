/* eslint-disable @typescript-eslint/naming-convention */
import type { VFC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { Props as ButtonProps } from '../../../ui/Button/Button';
import { Button } from '../../../ui/Button/Button';
import { Modal } from '../../../ui/Modal/Modal';
import type { Task } from '../task-queue.reducer';

const CloseButton = styled(Button)`
  margin-right: 15px;
  margin-left: -3px;
`;

const INDENT = 2;

interface Props {
  task: Task;
  onClick: () => void;
}

const mapStatusToButtonVariant: Record<Task['status'], ButtonProps['variant']> =
  {
    WAITING: 'info',
    RUNNING: 'success',
    ERROR: 'danger',
    SUCCESS: 'dark',
  } as const;

export const TaskElement: VFC<Props> = ({ task, onClick }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={(): void => {
          setDetailsOpen(true);
        }}
        scale="small"
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
        scale="small"
        variant={mapStatusToButtonVariant[task.status]}
      />

      {detailsOpen && (
        <Modal
          onClose={(): void => {
            setDetailsOpen(false);
          }}
        >
          <pre>{JSON.stringify(task.stdout, null, INDENT)}</pre>
        </Modal>
      )}
    </>
  );
};
