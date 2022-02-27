const express = require('express');
const router = express.Router();
const createError = require('http-errors');
const validate = require('../../lib/validations');
const exceptions = require('../../lib/exceptions');
const heatSheet = require('../../database_entities/heatSheet');

router.get('/', async (req, res, next) => {

    const meetId = req.query['meetId'];
    const teamId = req.query['teamId'];
    const individualId = req.query['individualId'];

    if (meetId && validate.isInt(meetId)) {
        heatSheet.getHeatSheet(meetId, teamId, individualId)
            .then(data => {
                console.info(data);
                res.status(201).json(data);
            })
            .catch(error => {
                exceptions.createGetErrorResponse(next, error);
            });
    }else {
        next(createError(400, "Can't get a Heat Sheet without a MeetId!", next));
    }
});

module.exports = router;