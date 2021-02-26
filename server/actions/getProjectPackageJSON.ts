import * as fs from 'fs';
import * as path from 'path';

import { parseJSON } from './parseJSON';

interface PackageJSON {
  dependencies: Record<string, string>;
  devDependencies: Record<string, string>;
}

export function getProjectPackageJSON(projectPath: string): PackageJSON | null {
  const packageJSONpath = path.join(projectPath, 'package.json');
  if (fs.existsSync(packageJSONpath)) {
    return parseJSON<PackageJSON>(fs.readFileSync(packageJSONpath, { encoding: 'utf8' }));
  }

  return null;
}
