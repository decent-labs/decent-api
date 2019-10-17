import express from 'express';

import { cors, encoding, logging, storage, errors } from './middleware';
import { router } from './router';

export const api = database => {
  const server = express();

  cors(server);
  encoding(server);
  logging(server);
  storage(server, database);
  router(server);
  errors(server);

  return server;
};
