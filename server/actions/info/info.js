import request from 'request';

function requestWithPromise(url) {
  return new Promise((resolve) => {
    request(url, (error, response, body) => {
      resolve(body);
    });
  });
}

export async function info(_, res) {
  const results = await requestWithPromise(`https://raw.githubusercontent.com/q-nick/npm-gui/master/INFO?${new Date().getTime()}`);
  res.send(results);
}
