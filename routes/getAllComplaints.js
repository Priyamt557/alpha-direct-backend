var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');


router.post('/', async function (req, res, next) {
    const { agentId } = req.body
    if (!agentId) return res.json({ status: false, message: 'invalid call' })


    async function getMyData() {
        return await db.sequelize.query(`SELECT * FROM customer_complaints WHERE id = ${agentId};`, { type: db.sequelize.QueryTypes.SELECT });
    }

    let data = await getMyData();



    res.json({
        status: true,
        data:
            data
    });



});

module.exports = router;