/* eslint-disable @typescript-eslint/no-type-alias */
import type { Manager } from './dependency.types';

export type MiddlewareFunction<P = unknown> = (requestData: {
  params: P;
  extraParams: Record<string, boolean | string>;
}) => Record<string, boolean | string>;

export type ResponserFunction<
  B = unknown,
  P = unknown,
  R = unknown,
> = (requestData: {
  params: P;
  extraParams: {
    projectPathDecoded: string;
    manager: Manager;
    xCacheId: string;
  };
  body: B;
}) => Promise<R> | R;
