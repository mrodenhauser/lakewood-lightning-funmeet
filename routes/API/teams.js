const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');
const team = require('../../database_entities/team');
const individual = require('../../database_entities/individual');

/* GET Teams with querystring filters */
router.get('/', async (req, res, next) => {


    let heatId = req.query['heatId'];
    let eventId = req.query['eventId'];
    let meetId = req.query['meetId'];

    if (validate.isInt(heatId) || validate.isInt(eventId) || validate.isInt(meetId)) {
        team.getTeams(heatId, eventId, meetId)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error =>{
                exceptions.createGetErrorResponse(next, error);
            });
    } else {
        next(createError(400,"Attempt to pull Teams without valid meetId, eventId, or heatId: "
            + meetId + ", " + eventId + ", " + heatId, next));
    }
});

/*POST an Team with details in request body as JSON */
router.post('/',async(req, res, next) => {
    let teamJson = req.body;

    team.create(teamJson)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(error =>{
            exceptions.createAddCreateErrorResponse(next, error);
        });
});

/* GET specific Team */
router.get('/:teamId', async (req, res, next) => {
    let teamId = req.params['teamId'];

    team.getById(teamId)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error =>{
            exceptions.createGetErrorResponse(next, error);
        });
});

/*POST a team to an event via association made in body (JSON) */
router.post('/:teamId/Events/:eventId',async(req, res, next) => {
    let eventId = req.params['eventId'];
    let teamId = req.params['teamId'];

    team.addToEvent(eventId, teamId)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(error =>{
            exceptions.createAddCreateErrorResponse(next, error);
        });
});

/*POST a team to a heat via association made in body (JSON)  */
router.post('/:teamId/Heats/:heatId',async(req, res, next) => {
    let heatId = req.params['eventId'];
    let teamId = req.params['teamId'];

    team.addToHeat(heatId, teamId)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(error =>{
            exceptions.createAddCreateErrorResponse(next, error);
        });
});

/*POST an event with event details in request body as JSON */
router.post('/:teamId/Individuals/:individualId',async(req, res, next) => {
    let teamId = req.params['teamId'];
    let individualId = req.params['individualId'];

    individual.addToTeam(teamId, individualId)
        .then(data => {
            res.status(201).json(data);
        })
        .catch(error =>{
            exceptions.createAddCreateErrorResponse(next, error);
        });
});

module.exports = router;