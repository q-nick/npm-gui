import * as fs from 'fs';
import * as path from 'path';

import { parseJSON } from './parseJSON';

export function getProjectPackageJSON(projectPath: string):any {
  const packageJSONpath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJSONpath)) {
    return parseJSON(fs.readFileSync(packageJSONpath, { encoding: 'utf8' }));
  }

  return null;
}
