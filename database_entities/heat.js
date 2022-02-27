const validate = require('../lib/validations');
const db = require('../lib/databaseOperations');
const individual = require('../database_entities/individual');
const team = require('../database_entities/team');

exports.getHeats = async function (meetId, eventId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(eventId)) {
                db.getEntities(
                    'fGetHeatsByEventId',
                    parseInt(eventId))
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                if (validate.isInt(meetId)) {
                    db.getEntities(
                        'fGetHeatsByMeetId',
                        parseInt(meetId))
                        .then(data => {
                            successFunc(data);
                        })
                        .catch(error => {
                            rejectedFunc(error);
                        });
                }
            }
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.create = async function createHeat(heatJson) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.createNewEntity(
            'fCreateHeat',
            [parseInt(heatJson['MeetId']),parseInt(heatJson['EventId'])])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.createAddIndividuals = async function createAddIndividuals(meetId, eventId, individualIds) {

    return new Promise((successFunc,rejectFunc) => {
        let heatObj = {
            MeetId: meetId,
            EventId: eventId
        };
        let heatId;
        this.create(heatObj)
            .then(data => {
                let heatAddPromises = [];
                heatId = data['HeatId'];
                individualIds.forEach((individualId) => {
                    heatAddPromises.push(individual.addToHeat(heatId, individualId));
                });
                Promise.all(heatAddPromises)
                    .then((data) => {
                        let result = {
                            HeatId:heatId,
                            IndividualAdds:data
                        };
                        successFunc(result);
                    })
                    .catch(error => {
                        console.error(error);
                        rejectFunc(new Error("Error while adding Individuals to the Heat" +
                            error.message));
                    });
            })
            .catch(error => {
                console.error(error);
                rejectFunc(new Error("Error while creating the heat:" + error.message));
            });
    });
};

exports.createAddTeams = async function createAddTeams(meetId, eventId, teamIds) {

    return new Promise((successFunc,rejectFunc) => {
        let heatObj = {
            MeetId: meetId,
            EventId: eventId
        };
        let heatId;
        this.create(heatObj)
            .then(data => {
                let heatAddPromises = [];
                heatId = data['HeatId'];
                teamIds.forEach((teamId) => {
                    heatAddPromises.push(team.addToHeat(heatId, teamId));
                });
                Promise.all(heatAddPromises)
                    .then((data) => {
                        let result = {
                            HeatId:heatId,
                            TeamAdds:data
                        };
                        successFunc(result);
                    })
                    .catch(error => {
                        console.error(error);
                        rejectFunc(new Error("Error while adding Teams to the Heat" +
                            error.message));
                    });
            })
            .catch(error => {
                console.error(error);
                rejectFunc(new Error("Error while creating the heat:" + error.message));
            });
    });
};

exports.getById = async function getHeatById(heatId) {


    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.getEntity(
            'fGetHeat',
            parseInt(heatId))
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectedFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};