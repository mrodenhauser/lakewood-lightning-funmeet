const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');

const meet = require('../../database_entities/meet');
const event = require('../../database_entities/event');



//Will re-enable this later when security features are added
//const cookieParser = require('cookie-parser');

/* GET all Meets with or without querystring filters */
router.get('/', async (req, res, next) =>  {
    meet.getMeets(req.query['since'], res, next)
        .then(data => {
            res.status(200).json(data);
        })
        .catch(error =>{
            exceptions.createGetErrorResponse(next, error);
        });
});

/*POST a Meet with meet details in request body as JSON */
router.post('/',async(req, res, next) => {
    let meetJson = req.body;
    if (meetJson && validate.isStringDate(meetJson['MeetDate'])) {
        meet.create(meetJson, res, next)
            .then(data => {
                res.status(201).json(data);
            })
            .catch(error =>{
                exceptions.createAddCreateErrorResponse(next, error);
            });
    } else {
        next(createError(400, "Must specify a valid date: " + meetJson['MeetDate'],next))
    }
});

/* GET specific meet */
router.get('/:meetId', async (req, res, next) => {

    let meetId = req.params['meetId'];

    if (validate.isInt(meetId)) {
        meet.getById(meetId, res, next)
            .then(data => {
                res.status(200).json(data);
            })
            .catch(error =>{
                exceptions.createGetErrorResponse(next, error);
            });
    } else {
        next(createError(400, "Must specify meetId as an integer: " + meetId, next));
    }
});

/*POST add an event to a meet */
router.post('/:meetId/Events/:eventId',async(req, res, next) => {
    let meetId = req.params['meetId'];
    let eventId = req.params['eventId'];

    if(validate.isInt(eventId) && validate.isInt(meetId)) {
        event.addToMeet(meetId, eventId, res, next)
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

/* GET specific Individual */
router.get('/:meetId/Events', async (req, res, next) => {
    let meetId = req.params['meetId'];
    let byIndividual = req.query['ByIndividual'];
    let forCircleIn = req.query['ForCircleIn'];
    let isByIndividual;

    isByIndividual = ((byIndividual && byIndividual.toLowerCase() === 'true') ||
        (forCircleIn && forCircleIn.toLowerCase() === 'true'));

    if(validate.isInt(meetId)) {
        if(isByIndividual) {
            event.getEventsByIndivdiualForMeet(meetId)
                .then(data => {
                        res.status(200).json(data);
                    }
                )
                .catch(error => {
                    res.status(500).send('Could not load the events by individual due to a server error: '
                        + error);

                });
        }
        else {
            event.getByMeet(meetId)
                .then(data => {
                        res.status(200).json(data);
                    }
                )
                .catch(error => {
                    res.status(500).send('Could not load the events due to a server error: ' + error);

                });
        }
    }
    else{
        next(createError(400, "Couldn't load events due to invalid meet id " + meetId, next));
    }
});

module.exports = router;