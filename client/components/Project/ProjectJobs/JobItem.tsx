/* eslint-disable @typescript-eslint/no-type-alias */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import type { ComponentProps, FC } from 'react';
import { useState } from 'react';

import type { Job } from '../../../app/store.reducer';
import { Button } from '../../../ui/Button/Button';
import { Modal } from '../../../ui/Modal/Modal';

interface Props {
  readonly description: string;
  readonly status: Job['status'];
  readonly onRemove: () => void;
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

      <Button
        className="mr-5 ml-0"
        disabled={status === 'WORKING'}
        icon="x"
        onClick={onRemove}
        title="Remove"
        variant={getVariantForStatus(status)}
      />

      {detailsOpen ? (
        <Modal
          onClose={(): void => {
            setDetailsOpen(false);
          }}
        >
          {/* <pre>{JSON.stringify(stdout, null, INDENT)}</pre> */}
        </Modal>
      ) : null}
    </>
  );
};
