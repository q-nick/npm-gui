import * as path from 'path';

export function decodePath(pathEncoded:string):string {
  if (!pathEncoded) {
    return null;
  }
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
}
