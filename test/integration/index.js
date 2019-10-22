import dotenv from 'dotenv';
import { api } from '../../src/api';
import { databaseManager } from '../../src/database';
import { setDb } from '../../src/database/access';

dotenv.config();

let _testDbManager;
let _testApi;

describe("integration", function () {
  before(() => {
    return databaseManager(process.env.NODE_ENV).then(dbManager => {
      _testDbManager = dbManager;
      _testApi = api(setDb(dbManager.knexInstance()));
    });
  });

  require('./root');
  require('./notes');

  after(() => {
    return _testDbManager.dropDb().then(() => _testDbManager.close());
  });
});

export const testApi = () => _testApi;
