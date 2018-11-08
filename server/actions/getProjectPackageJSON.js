import fs from 'fs';
import path from 'path';
import { parseJSON } from './parseJSON';

export function getProjectPackageJSON(projectPath) {
  if (fs.existsSync(projectPath)) {
    return parseJSON(fs.readFileSync(path.join(projectPath, 'package.json')));
  }

  return null;
}
