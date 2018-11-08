import path from 'path';

export function decodePath(pathEncoded) {
  if (!pathEncoded) {
    return null;
  }
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
}
