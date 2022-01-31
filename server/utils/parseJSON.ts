// eslint-disable-next-line func-style
export function parseJSON<T>(stringToParse: string): T | null {
  let result = null;
  try {
    result = JSON.parse(stringToParse) as T;
  } catch {
    console.error('JSON error', stringToParse, '#');
    return null;
  }

  return result;
}
