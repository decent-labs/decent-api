import { root } from './root';

export const router = app => {
  app.use('/', root(app));
};
