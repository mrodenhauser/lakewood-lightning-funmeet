

const validate = require('../lib/validations');
const db = require('../lib/databaseOperations');
const secure = require('../lib/security');

exports.getIndividualsByNames = async function getIndividualByName(firstName, lastName) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.searchEntities('fGetIndividualByName', [firstName, lastName])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.create = async function createIndividual(individual){

    return new Promise ((successFunc,rejectFunc) => {
        try {
            db.createNewEntity(
                'fCreateIndividual',
                [individual['FirstName'],
                    individual['LastName'],
                    parseInt(individual['AgeOnInsert']),
                    validate.getOptStrElement(individual, 'DateOfBirth'),
                    validate.getOptStrElement(individual, 'NickName'),
                    validate.getOptStrElement(individual, 'Email'),
                    secure.getHash(individual['Password'][0]),
                    validate.getOptStrElement(individual, 'SwimtopiaId')])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.addToEvent = async function addIndividualToEvent(eventId, individualId) {
    return new Promise ((successFunc,rejectFunc) => {
        db.addEntityToGroup(
            'fAddIndividualToEvent',
            [parseInt(eventId), parseInt(individualId)])
            .then(data => {
                successFunc(data);
            })
            .catch(error => {
                 rejectFunc(error);
            });
    })
};

exports.addToHeat = async function addIndividualToHeat(heatId, individualId) {

    return new Promise ((successFunc,rejectFunc) => {
        db.addEntityToGroup(
            'fAddIndividualToHeat',
            [parseInt(heatId), parseInt(individualId)])
            .then(data => {
                successFunc(data);
            })
            .catch(error => {
                rejectFunc(error);
            });
    });
};

exports.addToTeam = async function addIndividualToTeam(teamId, individualId) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.addEntityToGroup(
                'fAddIndividualToTeam',
                [parseInt(teamId), parseInt(individualId)])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getById = async function getIndividualById(individualId) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.getEntity('fGetIndividual', individualId)
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getIndividualForLogin = async function getIndividualById(firstName,lastName,PasswordHash) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.getEntity('fGetIndividualByNamesAndPassword', [firstName,lastName,PasswordHash])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getIndividuals = async function getIndividuals(teamId, heatId, eventId, meetId) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(teamId)) {
                db.searchEntities('fGetIndividualsByTeamId', teamId)
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                if (validate.isInt(heatId)) {
                    db.searchEntities('fGetIndividualsByHeatId', heatId)
                        .then(data => {
                            successFunc(data);
                        })
                        .catch(error => {
                            rejectedFunc(error);
                        });
                } else {
                    if (validate.isInt(eventId)) {
                        db.searchEntities('fGetIndividualsByEventId', eventId)
                            .then(data => {
                                successFunc(data);
                            })
                            .catch(error => {
                                rejectedFunc(error);
                            });
                    } else {
                        if (validate.isInt(meetId)) {
                            db.searchEntities('fGetIndividualsByMeetId', meetId)
                                .then(data => {
                                    successFunc(data);
                                })
                                .catch(error => {
                                    rejectedFunc(error);
                                });
                        } else {
                            rejectedFunc(new Error("No search criteria was provided for getIndividuals"))
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getIndividualsForHeatAssignment = async function getIndividualsForHeatAssignment(eventId) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(eventId)) {
                db.searchEntities('fGetIndividualsForHeatAssignByEventId', eventId)
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                rejectedFunc(new Error("Cannot pull individuals for heat assignment without an EventId. "))
            }
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};