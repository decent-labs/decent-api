#!/usr/bin/env node

import debugLib from 'debug';
import dotenv from 'dotenv';
import http from 'http';

import appServer from './app';
import { databaseManager } from './database';

dotenv.config();

const debug = debugLib(`${process.env.LOGGING_BASE}:api`);
let server, port;

databaseManager(process.env.DB_NAME).then(dbManager => {
  if (!dbManager) throw new Error("no database! not starting api!");

  const app = appServer(dbManager.knexInstance());

  port = normalizePort(process.env.API_PORT || '3000');
  app.set('port', port);

  server = http.createServer(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}).catch(debug);

const normalizePort = val => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  const exit = (code, message) => {
    debug(message);
    process.exit(code);
  };

  switch (error.code) {
    case 'EACCES':
      return exit(1, `${bind} requires elevated privileges`);
    case 'EADDRINUSE':
      return exit(1, `${bind} is already in use`);
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('listening on ' + bind + ', ready for requests!');
};
