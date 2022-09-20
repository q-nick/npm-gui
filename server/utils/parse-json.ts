export const parseJSON = <T>(stringToParse: string): T | null => {
  let result = null;
  try {
    result = JSON.parse(stringToParse) as T;
  } catch {
    // eslint-disable-next-line no-console
    console.error('JSON error', stringToParse, '#');
    return null;
  }

  return result;
};
