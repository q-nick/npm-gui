// import * as path from 'path';
// import * as fs from 'fs';
// import express from 'express';

// import { decodePath } from '../decodePath';
// import executeCommand from '../executeCommand';
// import { parseJSON } from '../parseJSON';

// export async function getScripts(req: express.Request, res: express.Response):Promise<void> {
//   const projectPath = decodePath(req.params.projectPath);
//   const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`), { encoding: 'utf8' })); // tslint:disable:max-line-length
//   const scripts = packageJson.scripts || [];

//   res.json(Object.keys(scripts).map((name) => ({
//     name,
//     command: scripts[name],
//   })));
// }

// export async function addScript(_: express.Request, res: express.Response):Promise<void> {
//   res.json({});
// }

// export async function removeScript(req: express.Request, res: express.Response):Promise<void> {
//   const projectPath = decodePath(req.params.projectPath);
//   const packageJson = parseJSON(fs.readFileSync(path.normalize(`${projectPath}/package.json`), { encoding: 'utf8' })); // tslint:disable:max-line-length
//   delete packageJson.scripts[req.params.scriptName];
//   fs.writeFileSync(path.normalize(`${projectPath}/package.json`), JSON.stringify(packageJson, null, 2));
//   res.json({});
// }

// export async function runScript(req: express.Request, res: express.Response):Promise<void> {
//   const projectPath = decodePath(req.params.projectPath)!;

//   await executeCommand(projectPath, `npm run ${req.params.scriptName}`, true);

//   res.json({}); // probably wont happend
// }
export const x = 1;
