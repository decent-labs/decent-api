# decent api base

this project implements a _really nice_ boilerplate api using

* `nodejs`
* `express`
* postgres via `docker-compose`
* `knex`
* `cors`
* es6 support via `babel`
* testing via `mocha` and `chai`
* logging via `debug` and `morgan`
* error handling via nice middlewares
* linting via `eslint`
* hot reloading via `nodemon`
* lots of other best practices
* seriously read the code

the api exposes it's name, environment, version, and a dynamic list of all supported routes at it's root (`/`) route.

a full set of crud operations for "notes" exists at the `/notes` endpoint. notes are "soft deleted" because actually deleting data is lame.

a full integration test suite is included.

## development setup

install the project dependencies

```sh
$ yarn install
```

get yourself an `.env` file, then edit it appropriately (or not at all tbh)

```sh
$ cp .env.example .env
```

startup a database instance

```sh
$ docker-compose up -d
```

run the test suite

```sh
$ yarn test
```

start your development environment

```sh
$ yarn watch
```

## database migrations

don't even worry about it.

migrations are executed upon app startup, when there are new migrations to run.

you don't even need to manually create any databases, as the app startup script handles that too, who's name is based on an environment variable.

when running tests, a new database is created for you upon starting tests, and destroyed after finishing tests.

in the development environment, your database sticks around between app runs (unless you `docker-compose down`, in which case it's destroyed).

---

Made with 🖤 in Cleveland