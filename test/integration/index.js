import dotenv from 'dotenv';
import { api } from '../../src/api';
import { databaseSetup } from '../../src/database';

dotenv.config();

let _testDbManager;
let _testApi;

describe("integration", function () {
  before(() => {
    return databaseSetup(process.env.NODE_ENV).then(db => {
      _testDbManager = db.manager;
      _testApi = api(db.database);
    });
  });

  require('./root');
  require('./notes');

  after(() => {
    return _testDbManager.dropDb().then(() => _testDbManager.close());
  });
});

export const testApi = () => _testApi;
