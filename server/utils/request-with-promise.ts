import https from 'https';

export const requestGET = (hostname: string, path: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      port: 443,
      path,
      method: 'GET',
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
