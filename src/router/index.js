import { root } from './root';
import { notes } from './notes';

export const router = app => {
  app.use('/', root(app));
  app.use('/notes', notes);
};
