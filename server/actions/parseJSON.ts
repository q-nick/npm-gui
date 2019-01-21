export function parseJSON(stringToParse:string):any {
  let result = null;
  try {
    result = JSON.parse(stringToParse);
  } catch (e) {
    console.error('JSON error', stringToParse, '#');
    return null;
  }
  return result;
}
