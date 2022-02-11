import type { VFC } from 'react';
import { useContext, useEffect } from 'react';

import { ContextStore } from '../app/ContextStore';
import { Dependencies } from './Dependencies/Dependencies';

export const Global: VFC = () => {
  const {
    state: { projects },
    dispatch,
  } = useContext(ContextStore);

  const scope = projects['global'];

  useEffect(() => {
    if (!scope) {
      dispatch({ type: 'addProject', projectPath: 'global' });
    }
  }, [dispatch, scope]);

  if (!scope) {
    return null;
  }

  return <Dependencies projectPath="global" />;
};
