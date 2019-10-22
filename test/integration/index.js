import dotenv from 'dotenv';
import { api } from '../../src/api';
import { databaseSetup } from '../../src/database';

import { root } from './root';
import { notes } from './notes';

dotenv.config();

export const integration = () => {
  let _testDbManager;
  let _testApi;

  describe("integration", () => {
    before(() => {
      return databaseSetup(process.env.NODE_ENV).then(db => {
        _testDbManager = db.manager;
        _testApi = api(db.database);
      });
    });

    root(() => _testApi, '/');
    notes(() => _testApi, '/notes');

    after(() => {
      return _testDbManager.dropDb().then(() => _testDbManager.close());
    });
  });
};
