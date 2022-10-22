/* eslint-disable react/destructuring-assignment */
import type { ReactNode } from 'react';

import { ConfirmButton } from '../../../ui/Button/ConfirmButton';

export const ActionsCell = (): ReactNode => {
  return (
    <ConfirmButton
      icon="trash"
      onClick={console.log}
      title="Remove package from project"
      variant="danger"
    />
  );
};
