# decent api

this project implements a _really nice_ boilerplate api using

* highly-supported runtimes via `nodejs`
* simple servers via `express`
* postgres via `docker-compose`
* programmatic sql via `knex`
* extreme acess via `cors`
* es6 support via `babel`
* testing via `mocha` and `chai`
* logging via `debug` and `morgan`
* error handling via custom errors
* linting via `eslint`
* hot reloading via `nodemon`
* lots of other best practices
* seriously read the code

the api exposes it's name, environment, version, and a dynamic list of all supported routes at it's root (`/`) route.

a full set of crud operations for "notes" exists at the `/notes` endpoint. notes are "soft deleted" because actually deleting data is lame.

a full integration test suite is included.

## development setup

install the project dependencies

```
$ yarn install
```

get yourself an `.env` file, then edit it appropriately (or not at all tbh)

```
$ cp .env.example .env
```

startup a database instance

```
$ docker-compose up -d
```

run the test suite

```
$ yarn test
```

start your development environment

```
$ yarn watch
```

## database migrations

when you're ready to start making changes to the database, make a new migration file via

```
$ yarn migration your_migration_name
```

then go do your schema thing.

other than that, don't even worry about migrations.

migrations are executed upon api startup, when there are new migrations to run.

you don't even need to manually create any databases, as the api startup script handles that too. the database name is based on an environment variable called `DB_NAME`.

when running tests, a new database is created for you upon starting tests, and destroyed after finishing tests. this database name is based off of the `NODE_ENV` environment variable, which is hard set to `test` when running tests via `yarn run` but this is all irrelevant and it disappears as soon as tests are done.

in the development environment, your database sticks around between api runs (unless you `docker-compose down`, in which case it's destroyed).

---

Made with 🖤 in Cleveland