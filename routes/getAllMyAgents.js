var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');





// constants
const currentStartOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
const currentEndOfMonth = moment().clone().endOf('month').format('YYYY-MM-DD');
const currentTodayDate = moment().clone().startOf('Day').format('YYYY-MM-DD');
var findData = {
    'from_date': currentStartOfMonth,
    'to_date': currentEndOfMonth,
    'forAction': 'This Month',
}



router.post('/', async function (req, res, next) {
    const { agencyId } = req.body
    if (!agencyId) return res.json({ status: false, message: 'invalid call' })



    async function getTopAgents() {
        return await db.sequelize.query(`
            SELECT 
                users.id as agent_id,
      count(policies.id) as policy_count,  
                #(SELECT count(policies.id) FROM policies WHERE agent_id = users.id AND STATUS = 1 AND created_at between '${findData.from_date}' and '${findData.to_date}') AS active_policy_count,
                #(SELECT count(policies.id) FROM policies WHERE agent_id = users.id AND STATUS = 0 AND created_at between '${findData.from_date}' and '${findData.to_date}') AS deactive_policy_count,
      SUM(policies.status = 1) AS activated_policy_count,
      SUM(policies.status = 0) AS deactivated_policy_count,
      SUM(policies.status = 2) AS cancelled_policy_count,
      CONCAT(users.firstName, ' ', users.lastName) agent_name
            FROM policies 
            JOIN users ON policies.agent_id = users.id
            WHERE policies.created_at between '${findData.from_date}' and '${findData.to_date}' 
            group by policies.agent_id order by policy_count DESC
      `, { type: db.sequelize.QueryTypes.SELECT });

    }


    async function getMyAgents() {
        return await db.sequelize.query(`SELECT
    users.id,users.agency_id,users.firstName,users.lastName
FROM
     users
LEFT JOIN
     user_roles ON users.id = user_roles.user_id
LEFT JOIN
     roles ON roles.id = user_roles.role_id
WHERE
users.agency_id = ${agencyId} AND users.active = 1;`, { type: db.sequelize.QueryTypes.SELECT });
    }


    let topAgentOfMonth = await getTopAgents()
    let myAgents = await getMyAgents()



    res.json({
        status: true,
        data: {
            topagentOfMonth: topAgentOfMonth[0],
            myAgents
        }

    });



});

module.exports = router;