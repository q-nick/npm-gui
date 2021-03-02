import request from 'request';

export async function requestWithPromise(url: string): Promise<string> {
  return new Promise((resolve) => {
    request(url, (_: unknown, __: unknown, body) => {
      resolve(body);
    });
  });
}
