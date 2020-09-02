import request from 'request';
import express from 'express';

function requestWithPromise(url:string):Promise<string> {
  return new Promise((resolve) => {
    request(url, (_:any, __:request.Response, body) => {
      resolve(body);
    });
  });
}

export async function info(_:express.Request, res:express.Response):Promise<void> {
  const results = await requestWithPromise(`https://raw.githubusercontent.com/q-nick/npm-gui/master/INFO?${new Date().getTime()}`); // tslint:disable:max-line-length
  res.send(results);
}
