import * as path from 'path';

export function decodePath(pathEncoded:string): string {
  return path.normalize(Buffer.from(pathEncoded, 'base64').toString());
}
