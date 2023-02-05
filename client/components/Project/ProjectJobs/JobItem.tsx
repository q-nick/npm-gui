/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ComponentProps, FC } from 'react';
import { useState } from 'react';
import styled from 'styled-components';

import type { Job } from '../../../app/store.reducer';
import { Button } from '../../../ui/Button/Button';
import { Modal } from '../../../ui/Modal/Modal';

const CloseButton = styled(Button)`
  margin-right: 15px;
  margin-left: -3px;
`;

interface Props {
  description: string;
  status: Job['status'];
  onRemove: () => void;
}

const getVariantForStatus = (
  status: Job['status'],
): ComponentProps<typeof Button>['variant'] => {
  if (status === 'SUCCESS') {
    return 'success';
  }

  if (status === 'WORKING') {
    return 'info';
  }

  return 'primary';
};

export const JobItem: FC<Props> = ({ description, status, onRemove }) => {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Button
        onClick={(): void => {
          setDetailsOpen(true);
        }}
        title="Show details"
        variant={getVariantForStatus(status)}
      >
        {description}
        &nbsp;
        {status}
      </Button>

      <CloseButton
        disabled={status === 'WORKING'}
        icon="x"
        onClick={onRemove}
        title="Remove"
        variant={getVariantForStatus(status)}
      />

      {detailsOpen && (
        <Modal
          onClose={(): void => {
            setDetailsOpen(false);
          }}
        >
          {/* <pre>{JSON.stringify(stdout, null, INDENT)}</pre> */}
        </Modal>
      )}
    </>
  );
};
