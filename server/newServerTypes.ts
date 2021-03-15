export type MiddlewareFunction = ( // eslint-disable-line
  reqData: {
    params: Record<string, string>;
    extraParams: Record<string, boolean | string>;
  }
) => Record<string, boolean | string>;

export type ResponserFunction<T = any> = ( // eslint-disable-line
  reqData: {
    params: Record<string, string>;
    extraParams: { projectPathDecoded: string; yarnLock: boolean };
    body: T;
  }
) => Promise<any> | any;
