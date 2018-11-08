import fs from 'fs';
import path from 'path';
import { parseJSON } from './parseJSON';

export function getProjectPackageJSON(projectPath) {
  const packageJSONpath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJSONpath)) {
    return parseJSON(fs.readFileSync(packageJSONpath));
  }

  return null;
}
