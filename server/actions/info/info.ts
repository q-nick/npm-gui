import request from 'request';
import type express from 'express';

async function requestWithPromise(url: string): Promise<string> {
  return new Promise((resolve) => {
    request(url, (_: unknown, __: unknown, body) => {
      resolve(body);
    });
  });
}

export async function info(_: unknown, res: express.Response): Promise<void> {
  const results = await requestWithPromise(`https://raw.githubusercontent.com/q-nick/npm-gui/master/INFO?${new Date().getTime()}`);
  const x = await fetch('mongodb+srv://npm-gui-public:BvP1Ik3AfS4OOT3P@cluster0.9trdq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');
  console.log(x);
  res.send(results);
}
// BvP1Ik3AfS4OOT3P
