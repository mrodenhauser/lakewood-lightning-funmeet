const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');
const eventDefinition = require('../../database_entities/eventDefinition');

/* GET all eventDefinitions */
router.get('/', async (req, res, next) =>  {

    let since;
    if(validate.isStringDate(req.query['since'])){
        since = req.query['since'];
    }
    //else {
    //    since = new Date(2021, 5, 16); //date prior to app going into use
    //}
    eventDefinition.getEventDefinitions(since)
        .then(data =>{
            res.status(200).json(data);
        })
        .catch(error => {
            exp.createGetErrorResponse(next,error)
        });
});

/*POST an event definition with event definition details in request body as JSON */
router.post('/',async(req, res, next) => {

    let eventDefinitionJson = req.body;
    if(validate.isInt(eventDefinitionJson['TeamSizeMin'])
        && validate.isInt(eventDefinitionJson['TeamSizeMax'])
        && validate.isInt(eventDefinitionJson['DistanceNum'])
        && validate.isInt(eventDefinitionJson['MaxTeamsPerHeat'])
        && validate.isBoolean(eventDefinitionJson['IsTeamEvent'])) {

        eventDefinition.create(eventDefinitionJson)
            .then(data =>{
            res.status(201).json(data);
        })
            .catch(error => {
                exp.createAddCreateErrorResponse(next, error);
            });
    }
    else{
        next(createError) (400, console.warn,
            "Attempt to create an EventDefinition with invalid data: " + JSON.stringify(eventDefinitionJson),
            "Attempt to create an EventDefinition with invalid data: " + JSON.stringify(eventDefinitionJson),
            next);
    }
});

/* GET specific event */
router.get('/:eventDefinitionId', async (req, res, next) => {

    let eventDefinitionId = req.params['eventDefinitionId'];
    if(validate.isInt(eventDefinitionId)) {
        eventDefinition.getById(eventDefinitionId);
    }else {
        next(createError(400,
            "Attempt load an EventDefinition without valid eventDefinitionId: " + eventDefinitionId,
            next));
    }
});

module.exports = router;