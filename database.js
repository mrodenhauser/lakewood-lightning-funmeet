//import {Process as process} from "node/process";

require('dotenv').config()

const monitor = require('pg-monitor');

// Loading and initializing the library:
//const initOptions = {
//    promiseLib: Promise
//};

let config;

if(process.env.HEROKU_POSTGRESQL_NAVY_URL || process.env.MAX_DB_CONNS) { //running on HEROKU
    config = {
        promiseLib: Promise,
        connectionString: process.env.HEROKU_POSTGRESQL_NAVY_URL || process.env.DATABASE_URL,
        max: process.env.MAX_DB_CONNS || 20,
        ssl: {rejectUnauthorized: false}
    };
} else { //running locally...
    config = {
        promiseLib: Promise,
        connectionString: process.env.DATABASE_URL,
        max: 5,
        ssl: {rejectUnauthorized: false} //comment this out if you want to hit a local DB (that doesn't have SSL setup)
    };
}


// Loading and initializing the library:
const pgp = require('pg-promise')();

monitor.attach(config);

// Preparing the connection details:


//  process.env or local test db
//let cn = process.env.DATABASE_URL || 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres';


// Creating and exporting a new database instance from the connection details:
exports.db = pgp(config);
exports.promsise = pgp;