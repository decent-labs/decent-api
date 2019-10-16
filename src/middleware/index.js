import express from 'express';
import morgan from 'morgan';
import doCors from 'cors';

export const cors = (app) => {
  app.use(doCors());
};

export const encoding = (app) => {
  app.use(express.json())
};

export const logging = (app) => {
  const nodeEnv = process.env.NODE_ENV;

  const logLevel = nodeEnv === 'development' ? 'dev' : 'combined';
  const options = { skip: () => nodeEnv === 'test' };

  const logger = morgan(logLevel, options);
  app.use(logger);
};

export const storage = (app, db) => {
  app.use((_, res, next) => {
    res.locals.db = db;
    next();
  });
};

export const errors = app => {
  app.use((error, _, res, __) => {
    res.status(error.code).json({ error: error.message });
  });
}

export const makeError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  throw error;
};
