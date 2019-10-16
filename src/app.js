import express from 'express';

import { cors, encoding, logging, storage, errors } from './middleware';

const app = database => {
  const application = express();

  cors(application);
  encoding(application);
  logging(application);
  storage(application, database);
  errors(application);

  return application;
};

export default app;
