import * as path from 'path';

export function decodePath(pathEncoded: unknown): string {
  return path.normalize(Buffer.from(pathEncoded as string, 'base64').toString());
}
