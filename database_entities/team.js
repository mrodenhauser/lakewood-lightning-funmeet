const validate = require('../lib/validations');
const exceptions = require('../lib/exceptions');
const db = require('../lib/databaseOperations');
const individual = require('../database_entities/individual');

exports.getTeams = async function getTeams(heatId,eventId, meetId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(heatId)) {
                db.searchEntities('fGetTeamsByHeatId', parseInt(heatId))
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                if (validate.isInt(eventId)) {
                    db.searchEntities('fGetTeamsByEventId', parseInt(eventId))
                        .then(data => {
                            successFunc(data);
                        })
                        .catch(error => {
                            rejectedFunc(error);
                        });
                } else {
                    if (validate.isInt(meetId)) {
                        db.searchEntities('fGetTeamsByMeetId', parseInt(meetId))
                            .then(data => {
                                successFunc(data);
                            })
                            .catch(error => {
                                rejectedFunc(error);
                            });
                    } else {
                        rejectedFunc(new Error("Attempt to pull Teams without valid meetId, eventId, or heatId: "
                            + meetId + ", " + eventId + ", " + heatId));
                    }
                }
            }
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getTeamsForHeatAssignment = async function getTeamsForHeatAssignment(eventId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(eventId)) {
                db.searchEntities('fGetTeamsForHeatAssignByEventId', parseInt(eventId))
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                console.warn("Attempt to pull Teams for heat assignment without a valid eventId");
                rejectedFunc(new Error("Cannot get Teams for heat assignment without a valid eventId"));
            }
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.create = async function createTeam(teamJson) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (teamJson && teamJson.hasOwnProperty('TeamName')) {
                db.createNewEntity('fCreateTeam', [
                    teamJson['TeamName'],
                    teamJson['TeamTaunt'],
                    validate.getOptIntElement(teamJson, 'TeamCaptain')])
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                rejectedFunc(new Error("Must provide a valid TeamName: " + JSON.stringify(teamJson)));
                exceptions.logException(console.warn,
                    "Attempt to create a Team without valid TeamName: " + teamId);
            }
        } catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getTeamsByTeamCaptain = async function getTeamsByTeamCaptain(individualId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(individualId)) {
                db.searchEntities(
                    'fGetTeamByTeamCaptain',
                    parseInt(individualId))
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                rejectedFunc(new Error("Must provide a valid individualId: " + individualId));
                exceptions.logException(console.warn,
                    "Attempt to pull Team(ByTeamCaptain) without valid individualId: " + individualId);
            }
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.getById = async function getTeam(teamId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(teamId)) {
                db.getEntity(
                    'fGetTeam',
                    parseInt(teamId))
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                rejectedFunc(new Error("Must provide a valid teamId: " + teamId));
                exceptions.logException(console.warn,
                    "Attempt to pull Team without valid teamId: " + teamId);
            }
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.addToEvent = async function addTeamToEvent(eventId, teamId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.addEntityToGroup(
            'fAddTeamToEvent',
            [parseInt(eventId), parseInt(teamId)])
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

exports.removeFromEvent = async function removeIndividualFromEvent(eventId, teamId) {
    return new Promise ((successFunc,rejectFunc) => {
        db.removeEntityFromGroup(
            'fRemoveTeamFromEvent',
            [parseInt(eventId), parseInt(teamId)])
            .then(data => {
                successFunc(data);
            })
            .catch(error => {
                rejectFunc(error);
            });
    })
};

exports.addToHeat = async function addTeamToHeat(heatId, teamId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            if (validate.isInt(heatId) && validate.isInt(teamId)) {
                db.addEntityToGroup('fAddTeamToHeat',
                    [parseInt(heatId), parseInt(teamId)])
                    .then(data => {
                        successFunc(data);
                    })
                    .catch(error => {
                        rejectedFunc(error);
                    });
            } else {
                rejectedFunc(new Error("Must provide a valid heatId and teamId: "
                    + heatId + ", " + teamId));
                exceptions.logException(console.warn,
                    "Attempt to add Team to Event without valid heatId and teamId: "
                    + heatId + ", " + teamId);
            }
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.createAddMembers = async function createTeam(teamName, teamTaunt, teamCaptainIndividualId, individualIds) {
    return new Promise((successFunc,rejectFunc) => {
        let teamObj = {
            TeamName: teamName,
            TeamTaunt: teamTaunt,
            TeamCaptain: teamCaptainIndividualId
        };
        let teamId;
        this.create(teamObj)
            .then(data => {
                let teamAddPromises = [];
                teamId = data['TeamId'];
                individualIds.forEach((individualId) => {
                    teamAddPromises.push(individual.addToTeam(teamId, individualId));
                });
                Promise.all(teamAddPromises)
                    .then((data) => {
                        let result = {
                            TeamId:teamId,
                            MemberAdds:data
                        };
                        successFunc(result);
                    })
                    .catch(error => {
                        console.error(error);
                        rejectFunc(new Error("Error while adding members to the team" +
                            error.message));
                    });
            })
            .catch(error => {
                console.error(error);
                rejectFunc(new Error("Error while creating the team:" + error.message));
            });
    });
}