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

// local
// const cn = 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres';

// heroku remote
//const cn = 'postgres://khjwxjvjkxxldh:24935094ee474f4fc65f2dfeb6d4e4eee67036bafc9473751f67eb411ce20c01@ec2-107-22-245-82.compute-1.amazonaws.com:5432/d3jq4rrtb9856q';

// env
let cn = process.env.DATABASE_URL;

//use latest known credentials if process.env not working.
///if (cn === undefined){
//    cn = 'postgres://khjwxjvjkxxldh:24935094ee474f4fc65f2dfeb6d4e4eee67036bafc9473751f67eb411ce20c01@ec2-107-22-245-82.compute-1.amazonaws.com:5432/d3jq4rrtb9856q';
//}

// Creating and exporting a new database instance from the connection details:
exports.db = pgp(cn);
exports.promsise = pgp;