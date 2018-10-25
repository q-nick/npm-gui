export function parseJSON(stringToParse) {
  let result = null;
  try {
    result = JSON.parse(stringToParse);
  } catch (e) {
    console.error('JSON error');
    return null;
  }
  return result;
}
