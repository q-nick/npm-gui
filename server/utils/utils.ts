export const ZERO = 0;
export const ONE = 1;

export const HTTP_STATUS_OK = 200;
export const HTTP_STATUS_BAD_REQUEST = 400;
export const HTTP_STATUS_NOT_FOUND = 404;

export const notEmpty = <TValue>(
  value: TValue | null | undefined,
): value is TValue => {
  return value !== null && value !== undefined;
};
