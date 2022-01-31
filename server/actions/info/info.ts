import type { ResponserFunction } from '../../newServerTypes';
import { requestWithPromise } from '../../utils/requestWithPromise';

export const info: ResponserFunction = async () => {
  const result = await requestWithPromise(
    `https://raw.githubusercontent.com/q-nick/npm-gui/master/INFO?${Date.now()}`,
  );
  return result;
};
