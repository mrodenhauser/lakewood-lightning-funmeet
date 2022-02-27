const pgp = require('../database').promsise;
const qrError =  pgp.errors.QueryResultError;
const qrErrorCodes = pgp.errors.queryResultErrorCode;
const createError = require('http-errors');

exports.logException = async function(logFunc, logMsg, error){
    let logMessage;
    if(error && error !== '') {
        logMessage = logMsg + ". Error: " + error.message + ". Stack: " + error.stack;
    }
    else{
        logMessage = logMsg + error;
    }
    logFunc(logMessage);

};

exports.logDbOffline = async function(error){
    let logMessage;
    if(error) {
        logMessage = "Error establishing postgres database connection. Error: "
            + error.message + ". Stack: " + error.stack;
    }
    else{
        logMessage = "Error establishing postgres database connection." ;
    }
    console.error(logMessage);

};
exports.logGetError = async function (error, funcName, parameters) {

    if (error instanceof qrError) {
        if (error.code === qrErrorCodes.noData) {
            this.logException(console.warn,
                "No rows returned from " + funcName + "(" + JSON.stringify(parameters) + ")",
                error);
            return;
        } else {
            if (error.code === qrErrorCodes.multiple) {
                this.logException(console.error,
                    "Multiple rows returned from " + funcName + "(" + JSON.stringify(parameters) + ")",
                    error);
                return;
            }
        }
    }
    this.logException(console.error,
        "Data could not be loaded via " + funcName + "(" + JSON.stringify(parameters) + ") due to an error",
        error);
};
exports.createGetErrorResponse = async function (next, error) {

    if (error instanceof qrError) {
        if (error.code === qrErrorCodes.noData) {
            next(createError(404,"No record(s) found."));
        } else {
            if (error.code === qrErrorCodes.multiple) {
                next(createError(500), "Could not load that unique record because multiple results matched the criteria.");
            }
        }
    }
    next(createError(500, "Error occurred, data not loaded.", next));
};

exports.logAddCreateError = async function(error, funcName, parameters) {

    try {
        if (error instanceof qrError) {
            if (error.code === qrErrorCodes.noData) {
                this.logException(console.error,
                    "No rows returned from " + funcName + "("
                    + JSON.stringify(parameters) + ")", error);
                return;
            } else {
                if (error.code === qrErrorCodes.multiple) {
                    this.logException(console.error,
                        "Multiple rows returned from " + funcName + "("
                        + JSON.stringify(parameters) + ")", error);
                    return
                }
            }
        }
        if (error && error.toString().includes("duplicate key value violates unique constraint")) {
            this.logException(console.warn,
                "Attempt to violate unique constraint via " + funcName + "("
                + JSON.stringify(parameters) + ")", error);
        } else {
            if(error && error.toString().includes("Cannot register the")){
                this.logException(console.warn,
                    "Attempt to perform invalid registration via " + funcName + "("
                    + JSON.stringify(parameters) + ")", error);
            }
            else {
                this.logException(console.error,
                    "Error occurred via " + funcName + "("
                    + JSON.stringify(parameters) + ")", error);
            }
        }
    }
    catch (error) {
        this.logException(console.error, "Error thrown while trying to handle another error. ", error);
    }
};

exports.createAddCreateErrorResponse = async function(next, error) {

    try {
        if (error instanceof qrError) {
            if (error.code === qrErrorCodes.noData) {
                next(createError(500, "Unexpected result. Might not have saved the record.", next));
            } else {
                if (error.code === qrErrorCodes.multiple) {
                    next(createError(500, "Unexpected result. Might not have saved the record.", next));
                }
            }
        }
        else {
            if (error && error.toString().includes("duplicate key value violates unique constraint")) {
                next(createError(409, "Could not save because the data already exists. " +
                    "Please check to see if the action has already been performed.", next));
            } else {
                if (error && error.toString().includes("Cannot register the")) {
                    next(createError(400, error.message, next));
                } else {
                    next(createError(500, "Error occurred, data not saved.", next));
                    ;
                }
            }
        }
    }
    catch (error) {
        next(createError(500, "The error caused another error. YEAH, SERIOUSLY, you messed up so bad that the first error " +
            "you caused was too weird to handle and cause another error! Stop doing what you're doing! ", next));
    }
};