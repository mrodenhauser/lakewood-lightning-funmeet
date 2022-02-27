const createError = require('http-errors');
const express = require('express');
const router = express.Router();
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');
const individual = require('../../database_entities/individual');

//Will re-enable this later when security features are added
//const cookieParser = require('cookie-parser');

/* GET Individuals with querystring filters */
router.get('/', async (req, res, next) =>  {
    let teamId = req.query['teamId'];
    let heatId = req.query['heatId'];
    let eventId = req.query['eventId'];
    let meetId = req.query['meetId'];

    if(validate.isInt(teamId) || validate.isInt(heatId) || validate.isInt(eventId) || validate.isInt(meetId)){
        individual.getIndividuals( teamId, heatId, eventId, meetId )
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error =>{
                exceptions.createGetErrorResponse(next, error);
            });
    }
    else {
        next(createError(400, "Can't load Individuals due to missing search criteria. " +
            "Must provide meetId, eventId, heatId, or teamId", next));
    }
});


/*POST an Individual with details in request body as JSON */
router.post('/',async(req, res) => {
    let individualJson = req.body;
    if (individualJson && validate.isInt(individualJson['AgeOnInsert'])) {
        individual.create(individualJson)
            .then(data => {
                    res.status(201).json(data);
                }
            )
            .catch(error =>{
                res.status(500).send('Could not Save the individual due to a server error: ' + error);

            });
    } else {
        next(createError(400, "Couldn't create individual due to invalid inputs."));
    }
});


/* GET specific Individual */
router.get('/:individualId', async (req, res, next) => {
    let individualId = req.params['individualId'];
    if(validate.isInt(individualId)) {
        individual.getById(individualId)
            .then(data => {
                    res.status(200).json(data);
                }
            )
            .catch(error =>{
                res.status(500).send('Could not Save the individual due to a server error: ' + error);

            });
    }
    else{
        next(createError(400, "Couldn't load individual due to invalid id: " +individualId, next));
    }
});

/*POST add an Individual to an Event via association made in body (JSON) */
router.post('/:individualId/Events/:eventId',async(req, res, next) => {
    let eventId = req.params['eventId'];
    let individualId = req.params['individualId'];

    if (validate.isInt(eventId) && validate.isInt(individualId)) {
        individual.addToEvent(eventId, individualId)
            .then(data => {
                    res.status(201).json(data);
                }
            )
            .catch(error => {
                res.status(500).send('Could not Save the individual due to a server error: ' + error);

            });
    }
    else{
        next(createError(400, "Couldn't add the individual to the event because of invalid inputs(" + individualId +
            ", " + eventId + "). ", next));
    }
});


/*POST an event with event details in request body as JSON */
router.post('/:individualId/Heats/:heatId',async(req, res, next) => {
    let heatId = req.params['heatId'];
    let individualId = req.params['individualId'];

    individual.addToHeat(heatId, individualId, res, next)
        .then(data => {
                res.status(201).json(data);
            }
        )
        .catch(error =>{
            res.status(500).send('Could not Save the individual due to a server error: ' + error);

        });
});


/*POST an event with event details in request body as JSON */
router.post('/:individualId/Teams/:teamId',async(req, res, next) => {
    let teamId = req.params['teamId'];
    let individualId = req.params['individualId'];

    if(validate.isInt(teamId) && validate.isInt(individualId)) {

        individual.addToTeam(teamId,individualId, res, next)
        .then(data => {
                res.status(201).json(data);
            }
        )
        .catch(error =>{
            res.status(500).send('Could not Save the individual due to a server error: ' + error);

        });
    }
    else{
        next(createError(400, "Couldn't add individual to heat due to improper inputs", next));
    }
});

module.exports = router;