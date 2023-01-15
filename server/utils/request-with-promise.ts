import type { ClientRequestArgs } from 'http';
import https from 'https';

export const requestGET = (hostname: string, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options: ClientRequestArgs = {
      hostname,
      port: 443,
      path: encodeURI(path),
      method: 'GET',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'User-Agent': 'npm-gui',
      },
    };

    const request = https.request(options, (response) => {
      let responseData = '';

      response.on('data', (data) => {
        responseData += data.toString();
      });
      response.on('end', () => {
        resolve(responseData);
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    request.end();
  });
};
