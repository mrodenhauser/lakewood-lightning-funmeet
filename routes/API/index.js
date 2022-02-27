const cool = require('cool-ascii-faces');
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const request = require('request');

const router = express.Router();

express()
  .use(express.static(path.join(__dirname, 'public')));


async function testSomeAPI() {
    return new Promise((resolve, reject) => {
        const options = {
            url: 'http://localhost:5000/API/Meets/14/Events?ForCircleIn=true',
            method: 'GET',
            json:true };

        request(options,
            function(error, response, body) {
                if(error){
                    reject(error);
                }
                else{
                    //let json = JSON.parse(body)
                    //console.log(response);
                    //console.log(json);
                    resolve(body);
                }
            });
    })
}

router.get('/', (req,res, next)=> {
    next(createError(404,cool()));
});

router.get('/test', (req,res, next)=> {

    testSomeAPI()
        .then(data => {
            res.status(200).json(data);
        });
});

module.exports = router;