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

    const { userId } = req.body
    if (!userId) return res.json({ status: false, message: 'Invalid User' })




    async function getAllThePolicies() {
        return await db.sequelize.query(`SELECT DATE(created_at) as policy_date,agent_id,
	agency_id ,status,COUNT(*) as row_count,policies.id FROM policies WHERE agent_id = ${userId};`, { type: db.sequelize.QueryTypes.SELECT })
    }

    // get monthly policy sale of agent
    async function getMonthlyPolicySales() {
        return await db.sequelize.query(`Select id,created_at from policies Where agent_id = ${userId} AND kyc_customer = 1 AND status = 1 AND created_at between '${findData.from_date}' and '${findData.to_date}'`, { type: db.sequelize.QueryTypes.SELECT })
    }

    // get today's policy sale of agent
    async function getTodayPolicySales() {
        return await db.sequelize.query(`Select * from policies Where agent_id = ${userId} AND kyc_customer = 1 AND status = 1 AND DATE(created_at) = CURDATE()`, { type: db.sequelize.QueryTypes.SELECT })
    }

    // get all policy sale of agent
    async function getAllTimePolicySales() {
        return await db.sequelize.query(`Select id from policies Where agent_id = ${userId} AND status = 1 AND kyc_customer = 1`, { type: db.sequelize.QueryTypes.SELECT })
    }


    let myAllPolicies = await getAllThePolicies();
    let monthlypolicy = await getMonthlyPolicySales();
    let todaypolicy = await getTodayPolicySales();
    let alltimepolicy = await getAllTimePolicySales();


    res.json({
        status: true,
        data: {
            myAllPolicies,
            todaypolicy,
            monthlypolicy,
            alltimepolicy,
        }
    });

});

module.exports = router;