import dotenv from 'dotenv';
import app from '../src/app';
import { databaseManager } from '../src/database';

dotenv.config();

let _testDbManager;
let _testDb;
let _testApp;

before(() => {
  return databaseManager(process.env.NODE_ENV).then(dbManager => {
    _testDbManager = dbManager;
    _testDb = dbManager.knexInstance();
    _testApp = app(_testDb);
  });
});

after(() => {
  return _testDbManager.dropDb().then(() => _testDbManager.close());
});

export const testApp = () => _testApp;
export const testDb = () => _testDb;
