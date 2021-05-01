import type { IncomingMessage, ServerResponse } from 'http';
import http from 'http';
import path from 'path';
import fs from 'fs';
import type { MiddlewareFunction, ResponserFunction } from './newServerTypes';
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

  public listen(port: number, host: string): void {
    this.server.listen(port, host);
    console.log('listening on: ', host, port);
  }

  public use(url: string, callback: MiddlewareFunction): void {
    this.middlewares.push({
      url,
      callback,
    });
  }

  public get(url: string, callback: ResponserFunction): void {
    this.responsers.push({
      url,
      method: 'GET',
      callback,
    });
  }

  public post(url: string, callback: ResponserFunction): void {
    this.responsers.push({
      url,
      method: 'POST',
      callback,
    });
  }

  public delete(url: string, callback: ResponserFunction): void {
    this.responsers.push({
      url,
      method: 'DELETE',
      callback,
    });
  }

  public any(url: string, callback: ResponserFunction): void {
    this.responsers.push({
      url,
      callback,
    });
  }

  private async onIncomingMessage(req: IncomingMessage, res: ServerResponse): Promise<void> {
    let extraParams: Record<string, boolean | string> = {
      xCacheId: req.headers['x-cache-id'] as string,
    };
    const bodyJSON: any = await Server.readBody(req);

    for (const middleware of this.middlewares) { // eslint-disable-line
      const pathRegex = new RegExp(middleware.url.replace(/:[\w]+/g, '.+'));

      if (req.url !== undefined && pathRegex.test(req.url)) {
        const params = Server.parseUrlParams(middleware.url, req.url);
        const myExtraParams = middleware.callback({
          params, extraParams,
        });
        extraParams = { ...extraParams, ...myExtraParams };
      }
    }

    for (const responser of this.responsers) { // eslint-disable-line
      const pathRegex = new RegExp(responser.url.replace(/:[\w]+/g, '.+'));
      const isMethodOk = responser.method === undefined || responser.method === req.method;
      if (!res.headersSent) { // ignore if already sent
        if (req.url !== undefined && isMethodOk && pathRegex.test(req.url)) {
          const params = Server.parseUrlParams(responser.url, req.url);
          try {
            const data = await responser.callback({params, extraParams: extraParams as any, body: bodyJSON}); // eslint-disable-line
            if (typeof data === 'string') {
              res.writeHead(HTTP_STATUS_OK, { 'Content-Type': 'text/html' });
              res.write(data, 'utf-8');
            } else {
              res.writeHead(HTTP_STATUS_OK, { 'Content-Type': 'application/json' });
              res.write(JSON.stringify(data), 'utf-8');
            }
          } catch (err: unknown) {
            console.error('ERROR HANDLER', err);
            res.writeHead(HTTP_STATUS_BAD_REQUEST, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(err), 'utf-8');
          }
        }
      }
    }

    if (!res.headersSent && req.url !== undefined) {
      // static
      const pathToFile = path.join(__dirname, req.url);

      if (req.url === '/') { // index.html
        res.write(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'));
      } else if (fs.existsSync(pathToFile)) {
        const extname = path.extname(pathToFile).toLowerCase() as keyof typeof mimeTypes;
        console.log(extname);
        const contentType = mimeTypes[extname];

        res.writeHead(HTTP_STATUS_OK, { 'Content-Type': contentType });
        res.write(fs.readFileSync(pathToFile, contentType.includes('text') ? 'utf-8' : undefined));
      } else { // 404 always return index.html
        res.write(fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8'));
      }
    }

    res.end();
  }
}
