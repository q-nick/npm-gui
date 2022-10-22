/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import type { VFC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import { Button } from '../../ui/Button/Button';
import { Modal } from '../../ui/Modal/Modal';

type Task = any;

const CloseButton = styled(Button)`
  margin-right: 15px;
  margin-left: -3px;
`;

const INDENT = 2;

interface Props {
  task: Task;
  onClick: () => void;
}

export const TaskElement: VFC<Props> = ({ task, onClick }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={(): void => {
          setDetailsOpen(true);
        }}
        title="Show details"
        variant="primary"
      >
        {task.description}
        {/* {task.description} */}
        &nbsp;
        {task.status}
      </Button>

      <CloseButton
        disabled={task.status === 'RUNNING'}
        icon="x"
        onClick={onClick}
        title="Remove"
        variant="primary"
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
