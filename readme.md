## Backend test [![Aptcoder](https://circleci.com/gh/Aptcoder/rise-test.svg?style=shield)](https://circleci.com/gh/Aptcoder/rise-test)

### What's different about this submission?

-   Along with unit tests, I also wrote feature tests for endpoints
-   Created a web view for easily exploring the audio and video streaming feature
-   Detailed documentation on postman on endpoint requirements and use
-   Uses Dependency Injection to provide extensibility and proper mocking for testing

### Relevant links

-   Live endpoint - https://rise-vest-044285c7bbfc.herokuapp.com/
-   Documentation - https://documenter.getpostman.com/view/11384363/2s9Y5YRhjb

### Project structure

```
-- config (project wide configurations)
-- tests (all tests are here)
-- src
---- controllers (web controllers - they decide what happens with api requests )
---- services (core logic)
---- repositories (Data access layer (or sort of).
---- migrations (database migrations)
---- loaders (things to setup the project; setup the db, DI container, and others...)
---- common
-------- interfaces
-------- dtos
-------- services (external services; cache, logger, storage  )
---- routes (setup routes and routes)

```

### Tools used

-   Node.js
-   Express
-   PostgreSQL
-   TypeORM
-   Docker - for containerization
-   Redis - as a session store
-   Type DI - for Dependency Injection
-   S3 - storage

### Installation and local setup

-   Run the command `git clone https://github.com/Aptcoder/rise-test` on your terminal to clone this repo to your current directory.

-   Run the command to check out to the project directory; `cd rise-test`

#### Without docker

-   Run `npm install` to install all required dependencies.

-   Create a `.env` file and fill it according to `.env.sample`

-   Run `make migrate-up` to run db migrations

-   Run `npm run test` to run tests.

-   Run `npm run start:dev` to run the project.

#### With docker

-   Create a `.env` file and fill it according to `.env.sample`

-   Run `docker compose build` to build the project.

-   Run `docker compose up` with necessary flags to run the project.

You're all set :)
