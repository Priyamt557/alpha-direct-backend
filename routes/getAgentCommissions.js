var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');


router.get('/', async function (req, res, next) {


    async function getMyData() {
        return await db.sequelize.query(`SELECT *
FROM
     agent_commissions;`, { type: db.sequelize.QueryTypes.SELECT });
    }

    let agent_commissions = await getMyData();



    res.json({
        status: true,
        data:
        {
            agent_commissions
        }
    });



});

module.exports = router;