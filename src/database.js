import debugLib from 'debug';
import dotenv from 'dotenv';
import path from 'path';
import knexManager from 'knex-db-manager';

dotenv.config();

const debug = debugLib(`${process.env.LOGGING_BASE}:database`);

export const databaseManager = name => {
  const config = {
    knex: {
      client: 'postgres',
      connection: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || '5432',
        database: name || process.env.DB_NAME || 'development',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres'
      },
      migrations: {
        directory: path.join(__dirname, '/migrations')
      }
    },
    dbManager: {
      superUser: process.env.DB_USER,
      superPassword: process.env.DB_PASS
    }
  };

  const dbManager = knexManager.databaseManagerFactory(config);

  return dbManager.createDbOwnerIfNotExist().then(() => {
    const knex = dbManager.knexInstance();
    return knex.raw('select 1+1 as result').then(() => {
      debug(`connected to ${process.env.NODE_ENV} database`);
    }).catch(() => {
      debug(`creating new ${process.env.NODE_ENV} database`);
      return dbManager.createDb();
    });
  }).then(() => {
    return dbManager.migrateDb();
  }).then(() => {
    debug(`${process.env.NODE_ENV} database migrated and ready to go`)
    return dbManager;
  }).catch(debug);
};
