import { Router } from 'express';

import { getRoot } from '../controllers/root';

export const root = (app) => {
  const router = Router();

  router.get('/', getRoot(app));

  return router;
}
