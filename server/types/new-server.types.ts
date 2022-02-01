/* eslint-disable @typescript-eslint/no-type-alias */
import type { Manager } from './dependency.types';

export type MiddlewareFunction = (requestData: {
  params: Record<string, string>;
  extraParams: Record<string, boolean | string>;
}) => Record<string, boolean | string>;

export type ResponserFunction<B = unknown, P = unknown> = (requestData: {
  params: P;
  extraParams: {
    projectPathDecoded: string;
    manager: Manager;
    xCacheId: string;
  };
  body: B;
}) => Promise<unknown> | unknown;
