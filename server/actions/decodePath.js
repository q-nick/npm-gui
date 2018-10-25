export function decodePath(pathEncoded) {
  return Buffer.from(pathEncoded, 'base64').toString();
}
