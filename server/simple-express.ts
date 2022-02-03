/* eslint-disable max-statements */
import fs from 'fs';
import type { IncomingMessage, ServerResponse } from 'http';
import http from 'http';
import path from 'path';

import type {
  MiddlewareFunction,
  ResponserFunction,
} from './types/new-server.types';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_OK } from './utils/utils';

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'vnd/ms-fontobject',
  '.otf': 'font/otf',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
  '.css.map': 'application/json',
  '.js.map': 'application/json',
};

export class Server {
  public readonly server: http.Server;

  private readonly middlewares: {
    url: string;
    callback: MiddlewareFunction;
  }[] = [];

  private readonly responsers: {
    url: string;
    method?: string;
    callback: ResponserFunction;
  }[] = [];

  public constructor() {
    this.server = http.createServer(this.onIncomingMessage.bind(this));
  }

  private static parseUrlParams(
    middlewarePath: string,
    requestUrl: string,
  ): Record<string, string> {
    const splitted = middlewarePath.split(/:\w+/g).filter((value) => value);
    const parametersValues = splitted
      // eslint-disable-next-line unicorn/no-array-reduce
      .reduce((url, split) => url.replace(split, '|'), requestUrl)
      .split('|')
      .filter((value) => value);
    const parametersNames = middlewarePath.match(/:\w+/g);
    const parameters = parametersNames?.reduce(
      (previousParameters, parameterName, index) => ({
        ...previousParameters,
        [parameterName.replace(':', '')]: parametersValues[index],
      }),
      {},
    );

    return parameters ?? {};
  }

  private static async readBody(request: IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
      let data = '';
      request.on('data', (chunk) => {
        data += chunk;
      });
      request.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({});
        }
      });
    });
  }

  public listen(port: number, host: string): void {
    this.server.listen(port, host);
    // eslint-disable-next-line no-console
    console.log('listening on:', host, port);
  }

  public use(url: string, callback: MiddlewareFunction<any>): void {
    this.middlewares.push({
      url,
      callback,
    });
  }

  public get(url: string, callback: ResponserFunction<any, any>): void {
    this.responsers.push({
      url,
      method: 'GET',
      callback,
    });
  }

  public post(url: string, callback: ResponserFunction<any, any>): void {
    this.responsers.push({
      url,
      method: 'POST',
      callback,
    });
  }

  public delete(url: string, callback: ResponserFunction<any, any>): void {
    this.responsers.push({
      url,
      method: 'DELETE',
      callback,
    });
  }

  public any(url: string, callback: ResponserFunction<any, any>): void {
    this.responsers.push({
      url,
      callback,
    });
  }

  private async onIncomingMessage(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    let extraParameters: Record<string, boolean | string> = {
      xCacheId: request.headers['x-cache-id'] as string,
    };
    const bodyJSON: any = await Server.readBody(request);
    try {
      for (const middleware of this.middlewares) {
        const pathRegex = new RegExp(middleware.url.replace(/:\w+/g, '.+'));

        if (request.url !== undefined && pathRegex.test(request.url)) {
          const parameters = Server.parseUrlParams(middleware.url, request.url);
          const myExtraParameters = middleware.callback({
            params: parameters,
            extraParams: extraParameters,
          });
          extraParameters = { ...extraParameters, ...myExtraParameters };
        }
      }

      for (const responser of this.responsers) {
        const pathRegex = new RegExp(responser.url.replace(/:\w+/g, '.+'));
        const isMethodOk =
          responser.method === undefined || responser.method === request.method;
        if (
          !response.headersSent &&
          request.url !== undefined &&
          isMethodOk &&
          pathRegex.test(request.url)
        ) {
          const parameters = Server.parseUrlParams(responser.url, request.url);
          // eslint-disable-next-line no-await-in-loop
          const data = await responser.callback({
            params: parameters,
            extraParams: extraParameters as any,
            body: bodyJSON,
          });
          if (typeof data === 'string') {
            response.writeHead(HTTP_STATUS_OK, { 'Content-Type': 'text/html' });
            response.write(data, 'utf-8');
          } else {
            response.writeHead(HTTP_STATUS_OK, {
              'Content-Type': 'application/json',
            });
            response.write(JSON.stringify(data), 'utf-8');
          }
        }
      }
    } catch (error: unknown) {
      console.error('ERROR HANDLER', error);
      response.writeHead(HTTP_STATUS_BAD_REQUEST, {
        'Content-Type': 'application/json',
      });
      response.write(JSON.stringify(error), 'utf-8');
    }

    if (!response.headersSent && request.url !== undefined) {
      // static
      const pathToFile = path.join(__dirname, request.url);

      if (request.url === '/') {
        // index.html
        response.write(
          fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'),
        );
      } else if (fs.existsSync(pathToFile)) {
        const extname = path
          .extname(pathToFile)
          .toLowerCase() as keyof typeof mimeTypes;

        const contentType = mimeTypes[extname];

        response.writeHead(HTTP_STATUS_OK, { 'Content-Type': contentType });
        response.write(
          fs.readFileSync(
            pathToFile,
            contentType.includes('text') ? 'utf-8' : undefined,
          ),
        );
      } else {
        // 404 always return index.html
        response.write(
          fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'),
        );
      }
    }

    response.end();
  }
}
