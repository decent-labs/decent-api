import { root } from './root';
import { notes } from './notes';

export const router = api => {
  api.use('/', root(api));
  api.use('/notes', notes);
};
