var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');
const goals = require('../constants');

const accountSid = accountSid;
const authToken = authToken;
const client = require('twilio')(accountSid, authToken);







/* get dashboard data. */
router.get('/', async function (req, res, next) {

    client.messages
        .create({
            body: 'Hi ',
            from: 'from',
            to: 'to'
        })
        .then(message => console.log(message.sid));




    res.json({
        status: true,
        data: {
            'result': "result"
        }
    });
});

module.exports = router;
