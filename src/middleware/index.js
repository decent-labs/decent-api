import debugLib from 'debug';
import express from 'express';
import morgan from 'morgan';
import doCors from 'cors';

export const cors = api => {
  api.use(doCors());
};

export const encoding = api => {
  api.use(express.json())
};

export const logging = api => {
  const nodeEnv = process.env.NODE_ENV;

  const logLevel = nodeEnv === 'development' ? 'dev' : 'combined';
  const options = { skip: () => nodeEnv === 'test' };

  const logger = morgan(logLevel, options);
  api.use(logger);
};

export const storage = (api, db) => {
  api.use((_, res, next) => {
    res.locals.db = db;
    next();
  });
};

export const errors = api => {
  const debug = debugLib(`${process.env.LOGGING_BASE}:error`);
  api.use((error, _, res, __) => {
    const publicMessage = { error: error.statusMessage || 'unknown error' };
    const secretMessage = { message: error.message, stack: error.stack };
    const internalMessage = { ...publicMessage, ...secretMessage };
    const prod = process.env.NODE_ENV === 'production';
    res.status(error.statusCode || 500).json(prod ? publicMessage : internalMessage);
    debug(internalMessage);
  });
};
