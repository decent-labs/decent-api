import debugLib from 'debug';
import path from 'path';
import knexManager from 'knex-db-manager';

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
      superUser: process.env.DB_USER || 'postgres',
      superPassword: process.env.DB_PASS || 'postgres'
    }
  };

  const dbManager = knexManager.databaseManagerFactory(config);

  return dbManager.createDbOwnerIfNotExist()
    .then(() => {
      const knex = dbManager.knexInstance();
      // this is how to check to see if a database is here or not
      // i wish there were a better way
      // if you know of one, submit a PR plz
      return knex.raw('select 1+1 as result')
        .then(() => debug(`connected to ${process.env.DB_NAME} database`))
        .catch(() => {
          debug(`creating new ${process.env.DB_NAME} database`);
          // if we got here, then no database exists and we need to create one
          //
          // returning a non-error here shows a warning in the console
          // (at least on node 10.16.3)
          // ¯\_(ツ)_/¯
          // we gotta do what we gotta do
          return dbManager.createDb();
        });
    })
    .then(() => dbManager.migrateDb())
    .then(() => {
      debug(`${process.env.DB_NAME} database migrated and ready to go`)
      return dbManager;
    })
    .catch(debug);
};

export const database = name => {
  return databaseManager(name)
    .then(manager => manager.knexInstance());
}
