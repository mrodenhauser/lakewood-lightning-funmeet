const express = require('express');
const router = express.Router();
const createError = require('http-errors');

const security = require('../lib/security');
const exHandlers = require('../lib/exceptions');
const validations = require('../lib/validations');
const dbIndividual = require('../database_entities/individual');
const dbEvent = require('../database_entities/event');
const dbTeam = require('../database_entities/team');
const dbHeat = require('../database_entities/heat');
const dbMeet = require('../database_entities/meet');

async function validateTeamAndGetIds(teamCaptainFirstName, teamCaptainLastName, teamCaptainIndividualId, firstNames, lastNames, individualIds) {

    let validationErrors = '';

    if (!teamCaptainFirstName)
        validationErrors += 'Team Captain First Name is required. ';

    if (!teamCaptainLastName)
        validationErrors += 'Team Captain Last Name is required. ';

    if (!teamCaptainIndividualId)
        validationErrors += 'Team Captain Individual Id is required. ';

    if (!(firstNames && Array.isArray(firstNames) && firstNames.length > 1)) {
        validationErrors += 'Must have at least two team members to make a team';
    } else {
        for (let lcv = 0; lcv < firstNames.length; lcv++) {
            if (!lastNames || !Array.isArray(lastNames) || lastNames.length < (lcv + 1)) {
                validationErrors += "Every Team Member must have a first and last name!";
            } else {
                if (!individualIds || !Array.isArray(individualIds)) {
                    validationErrors += "Didn't get an array of individualIds. ";
                } else {
                    if (individualIds[lcv] === '') {
                        try {
                            let matches = await dbIndividual.getIndividualsByNames(firstNames[lcv], lastNames[lcv]);
                            if (Array.isArray(matches) && matches.length > 0) {
                                individualIds[lcv] = matches[0]['IndividualId'];
                            } else {
                                validationErrors += 'We were unable to match ' + firstNames[lcv] + ' ' + lastNames[lcv];
                            }
                        } catch (error) {
                            console.error(error);
                            validationErrors += 'We were unable to match ' + firstNames[lcv] + ' ' + lastNames[lcv]
                                + '. It may have been a server error, but verify that the person has already ' +
                                'registered, and double check the spelling.';
                        }
                    } else if (!validations.isInt(individualIds[lcv])) {
                        validationErrors += 'Create Team form was pre-populated with invalid Individual IDs. ' +
                            'Try starting over.';
                    }
                }
            }
        }
    }
    return validationErrors;
}

router.post('/Register',async(req, res, next) => {

    let validationErrors = '';

    let individualJson = req.body;

    if(!individualJson['FirstName'])
        validationErrors += 'First Name is required.<br>';

    if(!individualJson['LastName'])
        validationErrors += 'Last Name is required.<br>';

    if(!individualJson['Age'] || !validations.isInt(individualJson['Age']))
        validationErrors += 'Age is required. <br>';
    else individualJson['AgeOnInsert'] = individualJson['Age'];

    if(individualJson['Password1'] !== individualJson['Password2']){
        validationErrors += 'Passwords do not match.';
    }
    else individualJson['Password'] = individualJson['Password1'];

    if(validationErrors === '')
        dbIndividual.create(individualJson)
            .then(data => {
                res.status(200).render('pages/Home',  {
                    Individual: data
                }  );
            })
            .catch(error =>{
                exHandlers.createGetErrorResponse(next, error);

            });
    else {
        res.status(200).render('pages/Register', {
            RegistrationResult: validationErrors,
            PreviousInput: individualJson
        });
    }
});

router.post('/LoginAttempt',async(req, res) => {

    let validationErrors = '';

    let firstName = req.body['FirstName'];
    let lastName = req.body['LastName'];
    let password = req.body['Password'];
    let passwordHash;

    if(!firstName)
        validationErrors += 'First Name is required. ';

    if(!lastName)
        validationErrors += 'Last Name is required. ';

    if(!password)
        validationErrors += 'Password is required. ';
    else {
        passwordHash = security.getHash(password);
    }

    if(validationErrors === '')
        dbIndividual.getIndividualForLogin(firstName, lastName, passwordHash)
            .then(data => {
                res.status(200).render('pages/Home',  {
                    Individual: data
                }  );
            })
            .catch(error =>{
                console.warn(firstName + ", " + lastName + " made an unsuccessful login attempt. " + error.message);
                res.status(400).render('pages/Login', {LoginResult: "The login attempt was " +
                        "unsuccessful. Please try again"});
            });
    else {
        res.status(400).render('pages/Login', {LoginResult: validationErrors});
    }
});

router.get('/Home',async(req, res, next) => {

    let meetId = req.query['MeetId'];
    let individualId = req.query['IndividualId'];
    let individualJson = req.body;


    let iPromise = dbIndividual.getById(individualId);
    let iePromise = dbEvent.getIndividualEventsByIndividual(individualId);
    let tePromise = dbEvent.getTeamEventsByIndividual(individualId);


    if (individualJson && validations.isInt(individualJson['IndividualId'])
        && individualJson['FirstName'] && individualJson['LastName'])
    {
        let meet;
        if (!validations.isInt(meetId)) {
            console.warn("No Meet Id specified, assuming latest. ");
            let meets = await dbMeet.getMeets();
            if (Array.isArray(meets) && meets.length > 0) {
                meet = meets[0]; //ordered by CreateDtm DESC
                meetId = meet.MeetId;
            } else {
                res.status(404).send("There are no Meets defined");
            }
        } else {
            meet = await dbMeet.getById(meetId);
        }

        Promise.all([iePromise,tePromise])
            .then(eventsData => {

                let individualEvents = eventsData[0];
                let teamEvents = eventsData[1];

                req.query['IndividualId'] = individualJson['IndividualId'];
                res.render('pages/Home', {
                    Individual: individualJson,
                    IndividualEvents: individualEvents,
                    TeamEvents: teamEvents,
                    Meet: meet
                });
            })
            .catch(error =>{
                exHandlers.createGetErrorResponse(next, "Could not load the Events due to a server error. "
                    + error);
            });
    }
    else{
        if (validations.isInt(individualId)){
            Promise.all([iPromise, iePromise,tePromise])
                .then(individualAndEventData => {

                    individualJson = individualAndEventData[0];
                    let individualEvents = individualAndEventData[1];
                    let teamEvents = individualAndEventData[2];

                    req.query['IndividualId'] = individualJson['IndividualId'];
                    res.render('pages/Home', {
                        Individual: individualJson,
                        IndividualEvents: individualEvents,
                        TeamEvents: teamEvents,

                    });
                })
                .catch(error =>{
                    exHandlers.createGetErrorResponse(next, "Could not load the Individuals and/or Events due to a server error. "
                        + error);
                });
        }
        else{
            next(createError(400,"There was an attempt to load Home with an invalid individualId", next));
            res.redirect('/Login');
        }
    }
});

router.get('/MyIndividualEvents',async(req, res, next) => {

    let individualId = req.query['IndividualId'];
    let forWithdrawal = (req.query['ForWithdrawal'] === '1');

    if (validations.isInt(individualId)){

        let ciPromise = dbIndividual.getById(individualId);
        let iePromise = dbEvent.getIndividualEventsByIndividual(individualId);

        Promise.all([ciPromise,iePromise])
            .then(data => {
                let curIndividual = data[0];
                let events = data[1];
                res.render('pages/MyEventList', {
                    EventsType: "Individual",
                    Individual: curIndividual,
                    Events: events,
                    IsWithdrawal: forWithdrawal
                });
            })
            .catch(error =>{
                exHandlers.createGetErrorResponse(next, "Could not load the Events due to a server error. "
                    + error);
            });
    }
    else{
        next(createError("There was an attempt to load myEventList with an invalid individualId", next));
        res.redirect('/Login');
    }
});

router.get('/MyTeamEvents',async(req, res, next) => {

    let individualId = req.query['IndividualId'];
    let forWithdrawal = (req.query['ForWithdrawal'] === '1');

    if (validations.isInt(individualId)){

        let ciPromise = dbIndividual.getById(individualId);
        let iePromise = dbEvent.getTeamEventsByIndividual(individualId);

        Promise.all([ciPromise,iePromise])
            .then(data => {
                let curIndividual = data[0];
                let events = data[1];
                res.render('pages/MyEventList', {
                    EventsType: "Team",
                    Individual: curIndividual,
                    Events: events,
                    IsWithdrawal: forWithdrawal
                });
            })
            .catch(error =>{
                exHandlers.createGetErrorResponse(next, "Could not load the Events due to a server error. "
                    + error);
            });
    }
    else{
        next(createError("There was an attempt to load myEventList with an invalid individualId", next));
        res.redirect('/Login');
    }
});

router.get('/MeetEvents',async(req, res, next) => {

    let meetId = req.query['MeetId'];
    let individualId = req.query['IndividualId'];


    if(!validations.isInt(individualId)){
        res.redirect('/Login')
    }
    else {
        let meet;

        if (!validations.isInt(meetId)) {
            console.warn("No Meet Id specified, assuming latest. ");
            let meets = await dbMeet.getMeets();
            if (Array.isArray(meets) && meets.length > 0) {
                meet = meets[0]; //ordered by CreateDtm DESC
                meetId = meet.MeetId;
            } else {
                res.status(404).send("There are no Meets defined");
            }
        } else {
            meet = await dbMeet.getById(meetId);
        }

        Promise.all([
            dbIndividual.getById(individualId),
            dbEvent.getByMeet(meetId)])
            .then((results) => {
                res.render('pages/MeetEventList', {
                    Meet: meet,
                    Individual: results[0],
                    Events: results[1]
                });
            })
            .catch(error => {
                exHandlers.createGetErrorResponse(next, "Could not load the Events due to a server error. "
                    + error);
            });
    }
});

router.get('/CreateTeam',async(req, res, next) => {

    let individualId = req.query['IndividualId'];
    let individualJson = req.body;

    if (individualJson && validations.isInt(individualJson['IndividualId'])
        && individualJson['FirstName'] && individualJson['LastName'])
    {
        req.query['IndividualId'] = individualJson['IndividualId'];
        res.status(200).render('pages/createTeam', { Individual: individualJson });
    }
    else{
        if (validations.isInt(individualId)){
            dbIndividual.getById(individualId)
                .then(data => {
                    res.render('pages/CreateTeam',
                        { Individual: data });
                })
                .catch(error =>{
                    exHandlers.createGetErrorResponse(next, "Could not load the Individual due to a server error. "
                        + error);
                });
        }
        else{
            next(createError(400,"There was an attempt to load createTeam with an invalid individualId", next));
            res.redirect('/Login');
        }
    }
});

router.post('/CreateTeam',async(req, res, next) => {

    let teamName = req.body['TeamName'];
    let teamTaunt = req.body['TeamTaunt'];
    let firstNames = req.body['FirstName'];
    let lastNames = req.body['LastName'];
    let individualIds = req.body['IndividualId'];

    let teamCaptainFirstName = firstNames[0];
    let teamCaptainLastName = lastNames[0];
    let teamCaptainIndividualId = individualIds[0];

    let  validationErrors = await validateTeamAndGetIds(teamCaptainFirstName, teamCaptainLastName,
        teamCaptainIndividualId, firstNames, lastNames, individualIds);

    if (validationErrors !== '') {
        let team = {
            TeamName: teamName,
            TeamTaunt: teamTaunt,
            Individual: {
                FirstName: teamCaptainFirstName,
                LastName: teamCaptainLastName,
                IndividualId: teamCaptainIndividualId
            },
            FirstNames: firstNames,
            LastNames: lastNames,
            IndividualIds: individualIds,
            ValidationErrors: validationErrors
        };
        res.status(400).render('pages/CreateTeam?', team);
    }
    else {
        dbTeam.createAddMembers(teamName, teamTaunt, teamCaptainIndividualId, individualIds)
            .then(result => {
                res.status(200).redirect('/Team?TeamId=' + result['TeamId'] +
                    '&IndividualId=' + teamCaptainIndividualId);
            })
            .catch(error => {
                next(createError(500, error, next));
            });
    }
});

router.get('/Team',async(req, res, next) => {

    let individualId = req.query['IndividualId'];
    let teamId = req.query['TeamId'];

    if (validations.isInt(individualId) && validations.isInt(teamId)) {

        Promise.all([
            dbIndividual.getById(individualId),
            dbTeam.getById(teamId),
            dbIndividual.getIndividuals(teamId),
            dbEvent.getTeamEventsByTeam(teamId)])

            .then(([individual, team, members,events]) => {
                res.render('pages/Team', {
                    Individual: individual,
                    Team: team,
                    Members: members,
                    Events: events
                });
            })
            .catch(error => {
                exHandlers.createGetErrorResponse(next, "Could not load the team due to a server error. "
                    + error.message);
                console.error(error);
            });
    }
    else {
        console.warn("There was an attempt to load team with an invalid individualId or teamId");
        res.status(400).redirect('/Login');
    }
});

router.get('/MyTeams', async(req,res,next) =>{

    let individualId = req.query['IndividualId'];

    if (validations.isInt(individualId)) {

        Promise.all([
            dbIndividual.getById(individualId),
            dbTeam.getTeamsByTeamCaptain(individualId)])

            .then(([individual,teams]) => {

                if(typeof teams !== 'undefined' && teams.length > 0) {
                    let teamId = teams[0].TeamId;

                    Promise.all([
                        dbTeam.getById(teamId),
                        dbIndividual.getIndividuals(teamId),
                        dbEvent.getTeamEventsByTeam(teamId)])

                        .then(([team, members, events]) => {
                            res.render('pages/Team', {
                                Individual: individual,
                                Teams: teams,
                                Team: team,
                                Members: members,
                                Events: events
                            });
                        })
                        .catch(error => {
                            exHandlers.createGetErrorResponse(next, "Could not load the team due to a server error. "
                                + error.message);
                            console.error(error);
                        });
                } else {
                    res.render('pages/Team', {
                        Individual: individual,
                    });
                }
            })
            .catch(error => {
                exHandlers.createGetErrorResponse(next, "Could not load the team due to a server error. "
                    + error.message);
                console.error(error);
            });
    } else {
        console.warn("There was an attempt to load team with an invalid individualId or teamId");
        res.status(400).redirect('/Login');
    }
});

router.get('/CreateHeat',async(req, res, next) => {

    let eventId = req.query['EventId'];
    let individualId = req.query['IndividualId'];

    if (validations.isInt(eventId)) {
        Promise.all([
            dbIndividual.getById(individualId),
            dbEvent.getById(eventId),
            dbIndividual.getIndividualsForHeatAssignment(eventId),
            dbTeam.getTeamsForHeatAssignment(eventId)])
            .then(([curIndividual, event, individuals, teams]) => {
                let data =  {
                    Individual: curIndividual,
                    AdminId: individualId,
                    Event: event,
                    Individuals: individuals,
                    Teams: teams
                };
                res.status(200).render('pages/CreateHeat',data);
            })
            .catch(error => {
                exHandlers.createGetErrorResponse(next, "Could not load the Event, Individuals, or Teams due" +
                    " to a server error. " + error.message);
                console.error(error);
            });
    } else {
        res.status(400).redirect('/Login');
        console.warn("There was an attempt to load createHeat with an invalid eventId");
    }
});

router.post('/CreateHeat',async(req, res, next) => {

    let individualIds = req.body['HeatIndividualIds'];
    let teamIds = req.body['HeatTeamIds'];
    let eventId = req.body['EventId'];
    let meetId = req.body['MeetId'];
    let isTeamEvent = req.body['IsTeamEvent'];

    if(isTeamEvent === true) {
        dbHeat.createAddTeams(meetId, eventId, teamIds)
            .then(() => {
                Promise.all([
                    dbEvent.getById(eventId),
                    dbTeam.getTeamsForHeatAssignment(eventId)])
                    .then(([event, teams]) => {
                        res.status(200).render('pages/CreateHeat',
                            {
                                Event: event,
                                Teams: teams,
                                Message: 'Successfully created the Heat'
                            });
                    })
                    .catch(error => {
                        next(createError(500, error, next));
                    });
            });
    }
    else {
        dbHeat.createAddIndividuals(meetId, eventId, individualIds)
            .then(() => {
                Promise.all([
                    dbEvent.getById(eventId),
                    dbIndividual.getIndividualsForHeatAssignment(eventId)])
                    .then(([event, individuals]) => {
                        res.status(200).render('pages/CreateHeat',
                            {
                                Event: event,
                                Individuals: individuals,
                                Message: 'Successfully created the Heat'
                            });
                    })
                    .catch(error => {
                        next(createError(500, error, next));
                    });
            });
    }
});

router.get('/EventSignUp',async(req, res, next) => {

    let individualId = req.query['IndividualId'];
    let eventId = req.query['EventId'];

    if (validations.isInt(individualId) && validations.isInt(eventId)) {

        Promise.all(
            [
                dbIndividual.getById(individualId),
                dbTeam.getTeamsByTeamCaptain(individualId),
                dbEvent.getById(eventId),
                dbIndividual.getIndividuals(null,null,eventId,null),
                dbTeam.getTeams(null,eventId,null)
                ])
            .then(([individual,teamsByCaptain,event,competingIndividuals,competingTeams]) => {
                res.status(200).render('pages/EventSignUp',
                    {
                        Individual: individual,
                        Teams: teamsByCaptain,
                        Event: event,
                        IndividualCompetitors: competingIndividuals,
                        TeamCompetitors:competingTeams
                    });
            })
            .catch(error => {
                exHandlers.createGetErrorResponse(next,error);
            });
    }
    else{
        console.warn("There was an attempt to load EventSignUp with an invalid individualId and or eventId. ");
        if(!validations.isInt(individualId)) {
            res.status(400).redirect('/Login');
        }
        else {
            res.status(400).redirect('/MeetEvents?IndividualId=' + individualId);
        }
    }
});

router.post('/EventSignUp',async(req, res, next) => {

    let individualId = req.body['IndividualId'];
    let eventId = req.body['EventId'];
    let isTeamEvent = (req.body['IsTeamEvent'].toLowerCase() === "true");
    let teamCaptainIndividualId = req.body['TeamCaptainId'];
    let teamId = req.body['EventTeamId'];

    if (!validations.isInt(individualId)) {
        res.status(400).redirect('/Login');
        console.warn("Attempt to submit EventSignUp without individualId, redirecting to /login. ")
    }
    else {
        if (!validations.isInt(eventId)) {
            res.status(400).redirect('/MeetEvents?IndividualId=' + individualId);
            console.warn("Attempt to submit EventSignUp without eventId, redirecting to /MeetEvents");
        }
        else {
            if (isTeamEvent === true && (!validations.isInt(teamId) || teamCaptainIndividualId !== individualId)) {
                res.status(400).redirect('/MeetEvents?IndividualId=' + individualId);
                console.warn("Attempt to submit EventSignUp for a team event without teamId, or not as Team Captain," +
                    " redirecting to /MeetEvents");
            }
            else {
                if(isTeamEvent === true) {
                    dbTeam.addToEvent(eventId, teamId)
                        .then(() => {
                            res.status(200).redirect('/Team?TeamId=' + teamId +
                                '&IndividualId=' + teamCaptainIndividualId)
                        })
                        .catch(error => {
                            exHandlers.createAddCreateErrorResponse(next, error);
                        });
                }
                else {
                    dbIndividual.addToEvent(eventId, individualId)
                        .then(() => {
                            res.status(200).redirect('/MeetEvents?IndividualId=' + individualId);
                        })
                        .catch(error => {
                            exHandlers.createAddCreateErrorResponse(next, error);
                        });
                }
            }
        }
    }
});

module.exports = router;