/* eslint-disable @typescript-eslint/no-use-before-define */
export const getPartialObject = (
  object: Record<string, unknown>,
  expectedObject: Record<string, unknown>,
) => {
  const keys = Object.keys(expectedObject);

  const partialObject: Record<string, unknown> = {};

  for (const key of keys) {
    if (key in object) {
      const value = object[key];
      const expectedValue = expectedObject[key];

      partialObject[key] =
        Array.isArray(value) && Array.isArray(expectedValue)
          ? getPartialArray(value, expectedValue)
          : value;
    }
  }

  return partialObject;
};

export const getPartialArray = (
  array: Record<string, unknown>[],
  expectedArray: Record<string, unknown>[],
) => {
  return expectedArray.map((expectedRow, index) => {
    if (!array[index]) {
      throw new Error(`No element array at index ${index}`);
    }
    return getPartialObject(array[index], expectedRow);
  });
};
