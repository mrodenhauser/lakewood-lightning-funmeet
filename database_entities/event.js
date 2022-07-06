const validate = require('../lib/validations');
const db = require('../lib/databaseOperations');
const maps = require('../objectMappings');

function groupEventsByIndividual(eventsByIndividual) {

    const eventsGroupedByIndividual = eventsByIndividual.reduce((prev, curr) => {
        const individual_found = prev.find(x => (x.LastName === curr.LastName && x.FirstName === curr.FirstName));
        if(!individual_found){
            prev.push(maps.IndividualWithEventsMapping(curr));
        }
        else {
            const event_found = individual_found.Events.find(x => x.EventId === curr.EventId);
            if (!event_found) {
                individual_found.Events.push(maps.EventMapping(curr));
            }
            else {

            }
        }
        return prev;
    }, []);

    return eventsGroupedByIndividual;
}

exports.create = async function (eventJson) {

    return new Promise((successFunc,rejectFunc) => {
        try {
            db.createNewEntity('fCreateEvent', [
                parseInt(eventJson['EventDefinitionId']),
                eventJson['ScheduleDate'],
                parseInt(eventJson['AgeMin']),
                validate.getOptStrElement(eventJson, 'ScheduleTime'),
                validate.getOptIntElement(eventJson, 'AgeMax'),
                validate.getOptStrElement(eventJson, 'IsTeamEvent'),
                validate.getOptStrElement(eventJson, 'EventDescription'),
                validate.getOptStrElement(eventJson, 'DisplayRules'),
                validate.getOptIntElement(eventJson, 'TeamSizeMin'),
                validate.getOptIntElement(eventJson, 'TeamSizeMax'),
                validate.getOptIntElement(eventJson, 'DistanceNum'),
                validate.getOptIntElement(eventJson, 'MaxTeamsPerHeat')])
                .then(data => {
                    console.info("successfully created Event " + data['EventId']);
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getByMeet = async function (meetId) {
    return new Promise((successFunc,rejectFunc) =>
    {
        try {
            db.searchEntities(
                'fGetEventsByMeetId',
                parseInt(meetId))
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }


    });
};

exports.getEventsByIndivdiualForMeet = async function (meetId) {
    return new Promise((successFunc,rejectFunc) =>
    {
        try {
            db.getEntities(
                'fGetEventsByIndividualForMeetId',
                parseInt(meetId))
                .then(data => {
                    let structuredData = groupEventsByIndividual(data);
                    successFunc(structuredData);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getIndividualEventsByIndividual = async function (individualId) {
    return new Promise((successFunc,rejectFunc) =>
    {
        try {
            db.searchEntities(
                'fGetIndividualEventsByIndividualId',
                parseInt(individualId))
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getTeamEventsByIndividual = async function (individualId, captainOnly) {
    return new Promise((successFunc,rejectFunc) =>
    {
        if (typeof captainOnly === 'undefined' || !validate.isBoolean(captainOnly)){
            captainOnly = false;
        }
        try {
            db.searchEntities(
                'fGetTeamEventsByIndividualId',
                [parseInt(individualId),captainOnly])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getTeamEventsByTeam = async function (teamId) {
    return new Promise((successFunc,rejectFunc) =>
    {
        try {
            db.searchEntities(
                'fGetEventsByTeamId',
                parseInt(teamId))
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getOrphanMeets = async function () {
    return new Promise((successFunc,rejectFunc) => {
        try {
            db.searchEntities('fGetOrphanEvents',[])
            .then(data =>{
                successFunc(data);
            })
            .catch(error =>{
                rejectFunc(error);
            });
        }
        catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getById = async function(eventId) {

    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.getEntity(
            'fGetEvent',
            parseInt(eventId))
            .then(data => {
                successFunc(data);
            })
            .catch(error =>{
                rejectedFunc(error);
            });
        }
        catch (error) {
            console.error(error);
            rejectedFunc(error);
        }
    });
};

exports.addToMeet = async function (meetId, eventId) {
    return new Promise((successFunc,rejectedFunc) => {
        try {
            db.addEntityToGroup(
            'fAddEventToMeet',
            [parseInt(meetId), parseInt(eventId)])
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