const validate = require('../lib/validations');
const exceptions = require('../lib/exceptions');
const db = require('../lib/databaseOperations');

exports.create = async function (eventDefinitionJson) {

    return new Promise((successFunc,rejectFunc) => {
        try {
            db.createNewEntity(
                'fCreateEventDefinition',
                [eventDefinitionJson['EventDescription'],
                    eventDefinitionJson['DisplayRules'],
                    parseInt(eventDefinitionJson['TeamSizeMin']),
                    parseInt(eventDefinitionJson['TeamSizeMax']),
                    parseInt(eventDefinitionJson['DistanceNum']),
                    eventDefinitionJson['DistanceUnit'],
                    parseInt(eventDefinitionJson['MaxTeamsPerHeat']),
                    eventDefinitionJson['IsTeamEvent']])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getEventDefinitions = async function (sinceDtm, res, next) {

    return new Promise((successFunc,rejectFunc) => {
        try {
            if (!validate.isStringDate(sinceDtm)) {
                db.getEntities(
                    'fGetEventDefinitions'
                    , [])
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectFunc(error);
                    });
            } else {
                db.searchEntities(
                    'fGetEventDefinitions'
                    , [sinceDtm])
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectFunc(error);
                    });

            }
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getById = async function(eventDefinitionId, res, next) {

    db.getEntity(
            'fGetEventDefinition',
            parseInt(eventDefinitionId),
            res,next);
};