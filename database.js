const monitor = require('pg-monitor');

// Loading and initializing the library:
const initOptions = {
    promiseLib: Promise
};

// Loading and initializing the library:
const pgp = require('pg-promise')(initOptions);

monitor.attach(initOptions)

// Preparing the connection details:
const cn = 'postgresql://postgres:Jun3 Bug@localhost:5432/postgres';

// Creating and exporting a new database instance from the connection details:
exports.db = pgp(cn);
exports.promsise = pgp;