import type { IncomingMessage, ServerResponse } from 'http';
import http from 'http';
import fs from 'fs';
import type { MiddlewareFunction, ResponserFunction } from './newServerTypes';
import { HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_OK } from './utils/utils';

export class Server {
  public readonly server: http.Server;

  private readonly middlewares: {
    path: string;
    callback: MiddlewareFunction;
  }[] = [];

  private readonly responsers: {
    path: string;
    method?: string;
    callback: ResponserFunction;
  }[] = [];

  public constructor() {
    this.server = http.createServer(this.onIncomingMessage.bind(this)); // eslint-disable-line
  }

  private static parseUrlParams(middlewarePath: string, reqUrl: string): Record<string, string> {
    const splitted = middlewarePath.split(/:[\w]+/g).filter((val) => val);
    const paramsValues = splitted.reduce((url, split) => url.replace(split, '|'), reqUrl).split('|').filter((val) => val);
    const paramsNames = middlewarePath.match(/:[\w]+/g);
    const params = paramsNames?.reduce(
      (prevParams, paramName, index) => ({ ...prevParams, [paramName.replace(':', '')]: paramsValues[index] }),
      {},
    );

    return params ?? {};
  }

  private static async readBody(req: IncomingMessage): Promise<any> {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => {
        try {
          resolve(JSON.parse(data)); // eslint-disable-line
        } catch (err: unknown) {
          err;
          resolve({});
        }
      });
    });
  }

  public listen(port: number): void {
    this.server.listen(port);
    console.log('listening on: ', port);
  }

  public use(path: string, callback: MiddlewareFunction): void {
    this.middlewares.push({
      path,
      callback,
    });
  }

  public get(path: string, callback: ResponserFunction): void {
    this.responsers.push({
      path,
      method: 'GET',
      callback,
    });
  }

  public post(path: string, callback: ResponserFunction): void {
    this.responsers.push({
      path,
      method: 'POST',
      callback,
    });
  }

  public delete(path: string, callback: ResponserFunction): void {
    this.responsers.push({
      path,
      method: 'DELETE',
      callback,
    });
  }

  public any(path: string, callback: ResponserFunction): void {
    this.responsers.push({
      path,
      callback,
    });
  }

  private async onIncomingMessage(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let extraParams: Record<string, boolean | string> = {};
    const bodyJSON = await Server.readBody(req);

    for (const middleware of this.middlewares) { // eslint-disable-line
      const pathRegex = new RegExp(middleware.path.replace(/:[\w]+/g, '.+'));

      if (req.url !== undefined && pathRegex.test(req.url)) {
        const params = Server.parseUrlParams(middleware.path, req.url);
        const myExtraParams = middleware.callback({
          params, extraParams,
        });
        extraParams = { ...extraParams, ...myExtraParams };
      }
    }

    for (const responser of this.responsers) { // eslint-disable-line
      const pathRegex = new RegExp(responser.path.replace(/:[\w]+/g, '.+'));
      const isMethodOk = responser.method === undefined || responser.method === req.method;
      if (!res.headersSent) { // ignore if already sent
        if (req.url !== undefined && isMethodOk && pathRegex.test(req.url)) {
          const params = Server.parseUrlParams(responser.path, req.url);
          try {
            const data = await responser.callback({params, extraParams: extraParams as any, body: bodyJSON}); // eslint-disable-line
            res.writeHead(HTTP_STATUS_OK, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(data), 'utf-8');
          } catch (err: unknown) {
            console.error('ERROR HANDLER', err);
            res.writeHead(HTTP_STATUS_BAD_REQUEST, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(err), 'utf-8');
          }
        }
      }
    }

    if (!res.headersSent) {
      // static
      console.log('TODO', fs.existsSync(req.url!));
    }

    res.end();
  }
}
