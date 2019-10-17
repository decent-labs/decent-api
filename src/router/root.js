import { Router } from 'express';

import { getRoot } from '../controllers/root';

export const root = api => {
  const router = Router();

  router.get('/', getRoot(api));

  return router;
}
