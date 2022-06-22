//import {Process as process} from "node/process";

const monitor = require('pg-monitor');

// Loading and initializing the library:
const initOptions = {
    promiseLib: Promise
};

// Loading and initializing the library:
const pgp = require('pg-promise')(initOptions);

monitor.attach(initOptions)

// Preparing the connection details:

// local testing only
// const cn = 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres';

// env
let cn = process.env.DATABASE_URL || 'postgres://khjwxjvjkxxldh:24935094ee474f4fc65f2dfeb6d4e4eee67036bafc9473751f67eb411ce20c01@ec2-107-22-245-82.compute-1.amazonaws.com:5432/d3jq4rrtb9856q';


// Creating and exporting a new database instance from the connection details:
exports.db = pgp(cn);
exports.promsise = pgp;