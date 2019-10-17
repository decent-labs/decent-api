import dotenv from 'dotenv';
import { api } from '../src/api';
import { databaseManager } from '../src/database';

dotenv.config();

let _testDbManager;
let _testDb;
let _testApi;

before(() => {
  return databaseManager(process.env.NODE_ENV).then(dbManager => {
    _testDbManager = dbManager;
    _testDb = dbManager.knexInstance();
    _testApi = api(_testDb);
  });
});

after(() => {
  return _testDbManager.dropDb().then(() => _testDbManager.close());
});

export const testApi = () => _testApi;
export const testDb = () => _testDb;
