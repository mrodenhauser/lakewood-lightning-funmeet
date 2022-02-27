const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');
const heat = require('../../database_entities/heat');
const team = require('../../database_entities/team');

const individual = require('../../database_entities/individual');

//Will re-enable this later when security features are added
//const cookieParser = require('cookie-parser');

/* GET heats with querystring filters */
router.get('/', async (req, res, next) => {
    let meetId = req.query['meetId'];
    let eventId = req.query['eventId'];

    if (validate.isInt(meetId) && validate.isInt(eventId)) {
        heat.getHeats(meetId, eventId, res, next)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error => {
                exceptions.createGetErrorResponse(next, error);
            });
    }
    else {
        next(createError(400, "Attempt to pull Heats without valid eventId: " + eventId, next));
    }
});

/*POST a heat with event and meet details in request body as JSON */
router.post('/',async(req, res, next) => {
    let heatJson = req.body;

    if(heatJson && validate.isInt(heatJson['MeetId']) && validate.isInt(heatJson['EventId'])) {
        heat.create(heatJson, res, next)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error => {
                exceptions.createAddCreateErrorResponse(next, error);
            });
    }
    else{
        next(createError(400, "Could not create Heat due to invalid input: " + JSON.stringify(heatJson), next));
    }
});

/* GET specific heat */
router.get('/:heatId', async (req, res, next) => {
    let heatId = req.params['heatId'];

    if(validate.isInt(heatId)) {
        heat.getById(heatId, res, next);
    }
    else{
        next(createError(400, "Could not load Heat due to invalid heatId: " + heatId, next));
    }
});

/*POST the addition of an individual to an event */
router.post('/:heatId/Individuals/:individualId',async(req, res, next) => {
    let heatId = req.params['heatId'];
    let individualId = req.params['individualId'];

    if(validate.isInt(heatId) && validate.isInt(individualId)) {
        individual.addToHeat(heatId, individualId)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error => {
                exceptions.createAddCreateErrorResponse(next, error);
            });
    }
    else{
         next(createError(400, "Couldn't add individual to heat due to improper inputs", next));
    }
});

/*POST the addition of a team to an event */
router.post('/:heatId/Teams/:teamId',async(req, res, next) => {
    let heatId = req.params['heatId'];
    let teamId = req.params['teamId'];

    if(validate.isInt(heatId) && validate.isInt(teamId)) {
        team.addToHeat(heatId, teamId)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error => {
                exceptions.createAddCreateErrorResponse(next, error);
            });
    }
    else {
        next(createError(400, "Couldn't add team to heat due to improper inputs", next));
    }
});

module.exports = router;