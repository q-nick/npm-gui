import { useIsFetching, useIsMutating } from '@tanstack/react-query';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export const useIsProjectBusy = (projectPath: string) => {
  const isMutating = useIsMutating([projectPath]) > 0;
  const isFetching = useIsFetching([projectPath]) > 0;

  return isMutating || isFetching;
};
