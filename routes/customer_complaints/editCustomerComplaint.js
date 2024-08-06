var express = require('express');
var router = express.Router();
const db = require('../../model');
const moment = require('moment');


router.post('/', async function (req, res, next) {


    try {
        const { status, level, closing_date, agent_note, manager_note, policy_id, agent_id, id } = req.body;
        if (!id || !policy_id || !level || !agent_id) return res.json({
            status: false,
            data: {
                message: 'invalid request'
            }
        })

        async function editMyComplaint() {
            let query = `UPDATE customer_complaints SET `
            let updates = `${status !== '' && status !== undefined ? 'status = ' + status : ''}${closing_date !== '' && closing_date !== undefined ? ',closing_date = ' + closing_date : ''}${level !== '' && level !== undefined ? ',level = ' + level : ''}${agent_note !== '' && agent_note !== undefined ? ',agent_note = ' + agent_note : ''}${manager_note !== '' && manager_note !== undefined ? ',manager_note = ' + manager_note : ''} WHERE id = ${id};`
            if (updates[0] == ',') {
                updates = updates.replace(/^\s+/, '');
                updates = updates.slice(1);
                console.log('updatesupdatesupdates', updates)
            }
            query += updates;
            console.log('firstfirstfirst', query)
            return await db.sequelize.query(query);

        }

        let data = await editMyComplaint()


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