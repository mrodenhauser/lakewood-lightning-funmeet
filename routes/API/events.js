const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');
const event = require('../../database_entities/event');
const team = require('../../database_entities/team');
const individual = require('../../database_entities/individual');

//Will re-enable this later when security features are added
//const cookieParser = require('cookie-parser');

/* GET events with querystring filters */
router.get('/', (req, res, next) =>  {

    let meetId = req.query['meetId'];
    if(req.query.hasOwnProperty('meetId') && validate.isInt(meetId)) {
        event.getByMeet(meetId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error =>{
                exceptions.createGetErrorResponse(next, error);
            });
    }
    else{
        if(req.query.hasOwnProperty('orphaned')){
            event.getOrphanMeets();
        }
        else {
            next(createError(400, "Attempt to pull Events without valid meetId: " + meetId, next));
        }
    }
});

/*POST an event with event details in request body as JSON */
router.post('/',async(req, res, next) => {

    let eventJson = req.body;
    if (validate.isInt(eventJson['EventDefinitionId'])
        && validate.isStringDate(eventJson['ScheduleDate'])
        && validate.isInt(eventJson['AgeMin'])) {

        event.create(eventJson)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error =>{
                exceptions.createAddCreateErrorResponse(next, error);
            });
    } else {
        next(createError(400, "Could not create Event due to invalid inputs: " + JSON.stringify(eventJson)));
    }
});

/* GET specific event */
router.get('/:eventId', async (req, res, next) => {
    let eventId = req.params['eventId'];
    if(validate.isInt(eventId)) {
        event.getById(eventId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error =>{
                exceptions.createGetErrorResponse(next, error);
            });
    }
    else {
        next(createError(400, "Couldn't load an Event with an eventId: " + eventId, next));
    }
});

/*POST the addition of an event to a meet */
router.post('/:eventId/Meets/:meetId',async(req, res, next) => {
    let meetId = req.params['meetId'];
    let eventId = req.params['eventId'];

    if (validate.isInt(meetId) && validate.isInt(eventId)) {
        event.addToMeet(meetId,eventId)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error =>{
                exceptions.createAddCreateErrorResponse(next, error);
            });
    } else {
        next(createError(400, "Must specify meetId or eventId as an integer: " + meetId, next));
    }
});

/*POST the addition of an individual to an event */
router.post('/:eventId/Individuals/:individualId',async(req, res, next) => {
    let eventId = req.params['eventId'];
    let individualId = req.params['individualId'];

    if(validate.isInt(eventId) && validate.isInt(individualId)) {
        individual.addToEvent(eventId, individualId)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error => {
                exceptions.createAddCreateErrorResponse(next, error);
            });
    }
    else{
        next(createError(400, "Attempt to add individual to event without valid eventId or individualId: "
            + eventId + ", " + individualId, next));
    }
});

/*POST the addition of a team to an event */
router.post('/:eventId/Teams/:teamId',async(req, res, next) => {

    let eventId = req.params['eventId'];
    let teamId = req.params['teamId'];

    if (validate.isInt(eventId) && validate.isInt(teamId)) {
        team.addToEvent(eventId, teamId, res, next)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error => {
                exceptions.createAddCreateErrorResponse(next, error);
            });
    } else {
        next(createError(400, "Must provide a valid eventId and teamId: "
            + eventId + ", " + teamId, next));
    }
});

module.exports = router;
