import { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import useSWR from 'swr';

import type { ExplorerResponse } from '../../../../server/types/global.types';
import { swrKeepPreviousData } from '../../../hooks/swr-keep-previous-data';
import { useClickOutsideRef } from '../../../hooks/use-click-outside';
import { useToggle } from '../../../hooks/use-toggle';
import { fetcher } from '../../../service/utils';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export const useExplorer = () => {
  const { isOpen, onToggleIsOpen, onClose } = useToggle();
  const [filter, setFilter] = useState('');
  const [currentPath, setCurrentPath] = useState<string>('');
  const history = useHistory();

  const ref = useClickOutsideRef(onClose);

  const { data } = useSWR<ExplorerResponse>(
    `/api/explorer/${currentPath}`,
    fetcher,
    { use: [swrKeepPreviousData] },
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
