const db = require('../database').db;
const pgp = require('../database').promsise;
const exceptions = require('../lib/exceptions');
const secure = require('../lib/security');

exports.createNewEntity = function (funcName, parameters) {
    let conn;
    return new Promise ((successFunc,rejectFunc) => {
        db.connect()
            .then(obj => {
                conn = obj;
                conn.func(funcName, parameters, pgp.queryResult.one)
                    .then(data => {
                        secure.hashToNewProp(data, 'DateOfBirth', 'DobHash');
                        //res.status(201).json(data);//.send();
                        successFunc(data);
                    })
                    .catch(error => {
                        exceptions.logAddCreateError(error, funcName, parameters)
                        rejectFunc(error);
                    })
                    .finally(() => {
                        if (conn) {
                            conn.done();
                        }
                    });
            })
            .catch(error => {
                exceptions.logDbOffline(error);
                rejectFunc('Could not connect to the database! ' + error.message);
            });
    });
};

exports.addEntityToGroup = function (funcName, parameters) {
    let conn;
    return new Promise((successFunc,rejectFunc) => {
        db.connect()
            .then(obj => {
                conn = obj;
                conn.func(funcName, parameters, pgp.queryResult.many)
                    .then(data => {
                        secure.hashToNewProp(data, 'DateOfBirth', 'DobHash');
                        successFunc(data);
                    })
                    .catch(error => {
                        exceptions.logAddCreateError(error, funcName, parameters)
                        rejectFunc(error);
                    })
                    .finally(() => {
                        if (conn) {
                            conn.done();
                        }
                    });
            })
            .catch(error => {
                exceptions.logDbOffline(error);
                rejectFunc(error);
            });
    });
};

exports.removeEntityFromGroup = function (funcName, parameters) {
    let conn;
    return new Promise((successFunc,rejectFunc) => {
        db.connect()
            .then(obj => {
                conn = obj;
                conn.func(funcName, parameters, pgp.queryResult.any)
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        exceptions.logAddCreateError(error, funcName, parameters)
                        rejectFunc(error);
                    })
                    .finally(() => {
                        if (conn) {
                            conn.done();
                        }
                    });
            })
            .catch(error => {
                exceptions.logDbOffline(error);
                rejectFunc(error);
            });
    });
};

/*call this when there SHOULD be at least one*/
exports.getEntities = function (funcName, parameters) {//, res, next, responseProcessor) {
    let conn;

    return new Promise((successFunc,rejectFunc) => {
        db.connect()
            .then(obj => {
                conn = obj;
                conn.func(funcName, parameters, pgp.queryResult.many)
                    .then(data => {
                        secure.hashToNewProp(data, 'DateOfBirth', 'DobHash');
                        successFunc(data);
                    })
                    .catch(error => {
                        exceptions.logGetError(error, funcName, parameters);
                        rejectFunc(error);
                    })
                    .finally(() => {
                        if (conn) {
                            conn.done();
                        }
                    });
            })
            .catch(error => {
                exceptions.logDbOffline(error);
                rejectFunc(error);
            });
    });
};

/*call this when unsure what the result count will be*/
exports.searchEntities = function (funcName, parameters) {
    let conn;
    return new Promise((successFunc,rejectFunc) => {
        db.connect()
            .then(obj => {
                conn = obj;
                conn.func(funcName, parameters, pgp.queryResult.any)
                    .then(data => {
                        if (data && data.length > 0) {
                            secure.hashToNewProp(data, 'DateOfBirth', 'DobHash');
                        }
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectFunc(error);
                    })
                    .finally(() => {
                        if (conn) {
                            conn.done();
                        }
                    });
            })
            .catch(error => {
                exceptions.logDbOffline(error);
                rejectFunc(error);
            });
    });
};

exports.getEntity = function (funcName, parameters) { //}, res, next, responseProcessor) {
    let conn;
    return new Promise((successFunc,rejectFunc) => {
        db.connect()
            .then(obj => {
                conn = obj;
                conn.func(funcName, parameters, pgp.queryResult.one)
                    .then(data => {
                        secure.hashToNewProp(data, 'DateOfBirth', 'DobHash');
                        successFunc(data);
                    })
                    .catch(error => {
                        exceptions.logGetError(error, funcName, parameters);
                        rejectFunc(error);
                    })
                    .finally(() => {
                        if (conn) {
                            conn.done();
                        }
                    });
            })
            .catch(error => {
                exceptions.logDbOffline(error);
                rejectFunc(error);
            });
    });
};

