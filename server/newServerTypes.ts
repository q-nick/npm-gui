/* eslint-disable @typescript-eslint/no-type-alias */
import type { Manager } from './types/Dependency';

export type MiddlewareFunction = (requestData: {
  params: Record<string, string>;
  extraParams: Record<string, boolean | string>;
}) => Record<string, boolean | string>;

export type ResponserFunction<T = any> = (requestData: {
  params: Record<string, string>;
  extraParams: {
    projectPathDecoded: string;
    manager: Manager;
    xCacheId: string;
  };
  body: T;
}) => Promise<any> | any;
