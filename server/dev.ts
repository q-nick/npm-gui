import { start } from './index';

const [,,hostAndPort] = process.argv;

const [host, port] = hostAndPort?.split(':') ?? ['localhost', '3000'];

start(host, typeof port === 'string' ? parseInt(port, 10) : undefined);
