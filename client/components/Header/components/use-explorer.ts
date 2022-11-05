import { useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import type { ExplorerResponse } from '../../../../server/types/global.types';
import { fetchJSON } from '../../../service/utils';
import { useClickOutsideRef } from '../../../ui/hooks/use-click-outside';
import { useToggle } from '../../../ui/hooks/use-toggle';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useExplorer = () => {
  const { isOpen, onToggleIsOpen, onClose } = useToggle();
  const [filter, setFilter] = useState('');
  const [currentPath, setCurrentPath] = useState<string>('');
  const history = useHistory();

  const ref = useClickOutsideRef(onClose);

  const { data } = useQuery(
    [currentPath],
    () => fetchJSON<ExplorerResponse>(`/api/explorer/${currentPath}`),
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: false,
      keepPreviousData: true,
    },
  );

  const onClickProject = useCallback((): void => {
    onClose();
    if (data) {
      history.push(`/${window.btoa(data.path)}`);
    }
  }, [data, history, onClose]);

  useEffect(() => {
    if (!currentPath && data?.path) {
      setCurrentPath(data.path);
      history.push(`/${window.btoa(data.path)}`);
    }
  }, [currentPath, data?.path, history]);

  return {
    ref,
    onToggleIsOpen,
    isOpen,
    path: data?.path,
    list: data?.ls,
    filter,
    setFilter,
    onClickProject,
    setCurrentPath,
  };
};
