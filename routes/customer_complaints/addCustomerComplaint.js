var express = require('express');
var router = express.Router();
const db = require('../../model');
const moment = require('moment');


router.post('/', async function (req, res, next) {


    try {
        const { status, level, customer_note, policy_id, agent_id } = req.body;
        if (!status || !level || !customer_note || !policy_id || !agent_id) return res.json({
            status: false,
            data: {
                message: 'invalid request'
            }
        })
        async function addMyComplaint() {
            return await db.sequelize.query(`INSERT into customer_complaints (status,level,customer_note,    policy_id,agent_id)
            VALUES ('open','1','policy is fraud',102,1099);`);

        }

        let data = await addMyComplaint()


        return res.json({
            status: true,
            data: {
                data
            }
        })
    } catch (error) {
        return res.json({
            status: false,
            error: error
        })
    }



});

module.exports = router;