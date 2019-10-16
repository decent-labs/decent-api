#!/usr/bin/env node

import debugLib from 'debug';
import dotenv from 'dotenv';
import http from 'http';

import appServer from './app';
import { database } from './database';

dotenv.config();

const debug = debugLib(`${process.env.LOGGING_BASE}:api`);

let server, port;

database(process.env.DB_NAME).then(db => {
  if (!db) {
    throw new Error("unable to connect to database, not starting api");
  }

  const app = appServer(db)

  port = normalizePort(process.env.API_PORT || '3000');
  app.set('port', port);

  server = http.createServer(app);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);
}).catch(err => debug(err));

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }

  if (port >= 0) {
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  const exit = code => {
    process.exit(code);
  };

  switch (error.code) {
    case 'EACCES':
      debug(bind + ' requires elevated privileges');
      exit(1);
      break;
    case 'EADDRINUSE':
      debug(bind + ' is already in use');
      exit(1);
      break;
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
