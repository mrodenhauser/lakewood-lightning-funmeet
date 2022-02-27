const validate = require('../lib/validations');
const exceptions = require('../lib/exceptions');
const db = require('../lib/databaseOperations');

exports.create = async function createMeet(meetJson) {

    return new Promise((successFunc,rejectFunc) => {
        try {
            db.createNewEntity('fCreateMeet',
                [meetJson['MeetName'],
                    meetJson['MeetBannerDescription'],
                    meetJson['MeetDate']])
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getMeets = async function getMeets(sinceDtm) {

    let since;
    return new Promise((successFunc,rejectFunc) => {
        try {
            if (validate.isStringDate(sinceDtm)) {
                since = sinceDtm;
            } else {
                since = new Date(2021, 5, 16);
            }
            db.getEntities(
                'fGetMeets',
                since)
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};

exports.getById = async function getMeetById(meetId) {

    return new Promise((successFunc,rejectFunc) => {
        try {
            db.getEntity('fGetMeet', parseInt(meetId))
                .then(data => {
                    successFunc(data);
                })
                .catch(error => {
                    rejectFunc(error);
                });
        } catch (error) {
            console.error(error);
            rejectFunc(error);
        }
    });
};