//import {Process as process} from "node/process";

const monitor = require('pg-monitor');

// Loading and initializing the library:
//const initOptions = {
//    promiseLib: Promise
//};

const config = {
    promiseLib: Promise,
    connectionString: process.env.DATABASE_URL || 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres',
    max: process.env.MAX_DB_CONNS || 20,
    ssl:true
};

// Loading and initializing the library:
const pgp = require('pg-promise')();

monitor.attach(config);

// Preparing the connection details:


//  process.env or local test db
//let cn = process.env.DATABASE_URL || 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres';


// Creating and exporting a new database instance from the connection details:
exports.db = pgp(config);
exports.promsise = pgp;