/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from 'react';
import type { Middleware, SWRResponse } from 'swr';

// This is a SWR middleware for keeping the data even if key changes.
export const swrKeepPreviousData: Middleware = (useSWRNext) => {
  return (
    ...parameters
  ): SWRResponse<any, any> & {
    isLagging: boolean;
    resetLaggy: () => void;
  } => {
    // Use a ref to store previous returned data.
    const laggyDataRef = useRef<any>();

    // Actual SWR hook.
    const swr = useSWRNext(...parameters);

    useEffect(() => {
      // Update ref if data is not undefined.
      if (swr.data !== undefined) {
        laggyDataRef.current = swr.data;
      }
    }, [swr.data]);

    // Expose a method to clear the laggy data, if any.
    const resetLaggy = useCallback(() => {
      laggyDataRef.current = undefined;
    }, []);

    // Fallback to previous data if the current data is undefined.
    const dataOrLaggyData =
      swr.data === undefined ? laggyDataRef.current : swr.data;

    // Is it showing previous data?
    const isLagging =
      swr.data === undefined && laggyDataRef.current !== undefined;

    // Also add a `isLagging` field to SWR.
    return { ...swr, data: dataOrLaggyData, isLagging, resetLaggy };
  };
};
