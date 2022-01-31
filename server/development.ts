import { start } from './index';

// eslint-disable-next-line prefer-destructuring
const hostAndPort = process.argv[2];

const [host, port] = hostAndPort?.split(':') ?? ['localhost', '3000'];

start(host, typeof port === 'string' ? Number.parseInt(port, 10) : undefined);
