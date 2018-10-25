import path from 'path';
import fs from 'fs';
import { decodePath } from '../decodePath';
import executeCommand from '../executeCommand';
import { parseJSON } from '../parseJSON';

export async function getScripts(req, res) {
  const projectPath = decodePath(req.params.projectPath);
  const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`)));

  res.json(Object.keys(packageJson.scripts).map(name => ({
    name,
    command: packageJson.scripts[name],
  })));
}

export async function addScript(req, res) {
  res.json({});
}

export async function removeScript(req, res) {
  res.json({});
}

export async function runScript(req, res) {
  const projectPath = decodePath(req.params.projectPath);

  await executeCommand(projectPath, `npm run ${req.params.scriptName}`, true);

  res.json({}); // probably wont happend
}
