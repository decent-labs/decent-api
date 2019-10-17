import debugLib from 'debug';
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
  const debug = debugLib(`${process.env.LOGGING_BASE}:error`);
  app.use((error, _, res, __) => {
    const publicMessage = { error: error.statusMessage || 'unknown error' };
    const secretMessage = { message: error.message, stack: error.stack };
    const internalMessage = { ...publicMessage, ...secretMessage };
    const prod = process.env.NODE_ENV === 'production';
    res.status(error.statusCode || 500).json(prod ? publicMessage : internalMessage);
    debug(internalMessage);
  });
}

export const makeError = (code, message) => {
  const error = new Error(message);
  error.code = code;
  throw error;
};
