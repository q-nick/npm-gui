import request from 'request';

export const requestWithPromise = async (url: string): Promise<string> => {
  return new Promise((resolve) => {
    request(url, (_: unknown, __: unknown, body) => {
      resolve(body);
    });
  });
};
