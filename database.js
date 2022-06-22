//import {Process as process} from "node/process";

const monitor = require('pg-monitor');

// Loading and initializing the library:
const initOptions = {
    promiseLib: Promise,
    ///ssl:{
    //    rejectUnauthorized: false
    //}
};

// Loading and initializing the library:
const pgp = require('pg-promise')(initOptions);

monitor.attach(initOptions)

// Preparing the connection details:

// local testing only
// const cn = 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres';

// env
let cn = process.env.DATABASE_URL || 'postgres://ncgipwbjvdimxn:c84b682ba9e35e7fb1a5319321d3369a3d655c6c8972c758aa5627df7681b272@ec2-3-224-8-189.compute-1.amazonaws.com:5432/dch0qkdk3h6iia';


// Creating and exporting a new database instance from the connection details:
exports.db = pgp(cn);
exports.promsise = pgp;