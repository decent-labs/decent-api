#!/usr/bin/env node

import debugLib from 'debug';
import dotenv from 'dotenv';
import http from 'http';

import { api } from './api';
import { database } from './database';
import { setDb } from './database/access';

dotenv.config();

const debug = debugLib(`${process.env.LOGGING_BASE}:api`);
let server, port;

database(process.env.DB_NAME).then(database => {
  if (!database) throw new Error("no database! not starting api!");

  const connectedApi = api(setDb(database));

  port = normalizePort(process.env.API_PORT || '3000');
  connectedApi.set('port', port);

  server = http.createServer(connectedApi);
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
