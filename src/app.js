import express from 'express';

import { cors, encoding, logging, storage, errors } from './middleware';
import { router } from './router';

const app = database => {
  const application = express();

  cors(application);
  encoding(application);
  logging(application);
  storage(application, database);
  router(application);
  errors(application);

  return application;
};

export default app;
