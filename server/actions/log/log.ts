import type { ResponserFunction } from '../../newServerTypes';
import { requestWithPromise } from '../../utils/requestWithPromise';

export const log: ResponserFunction<{ id: string }> = async ({
  body: { id },
}) => {
  const result = await requestWithPromise(
    `https://npm-gui-stats.herokuapp.com/log/${id}`,
  );
  return result;
};
