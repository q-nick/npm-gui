import { existsSync, lstatSync, readdirSync, rmdirSync, unlinkSync } from 'fs';

export const deleteFolderRecursive = (rmPath: string): void => {
  let files = [];
  if (existsSync(rmPath)) {
    files = readdirSync(rmPath);
    for (const [, file] of files.entries()) {
      const currentPath = `${rmPath}/${file}`;
      if (lstatSync(currentPath).isDirectory()) {
        // recurse
        deleteFolderRecursive(currentPath);
      } else {
        // delete file
        unlinkSync(currentPath);
      }
    }
    rmdirSync(rmPath);
  }
};
