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
/* get dashboard data. */
router.post('/', async function (req, res, next) {

    const { userId, otherUserId, agency_id } = req.body;
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@2", otherUserId, userId)

    if (userId === null || userId === undefined || agency_id === null || agency_id === undefined) return res.json({ status: false, message: 'Invalid data' })


    //     async function getComparisonData() {
    //         return await db.sequelize.query(`SELECT
    // 	DATE(created_at) as policy_date,
    // 	COUNT(*) as row_count,
    // 	agent_id
    // FROM
    // 	policies
    // GROUP BY
    // 	policy_date,
    // 	agent_id
    // ORDER BY
    // 	agent_id
    //     LIMIT 200; `, { type: db.sequelize.QueryTypes.SELECT });

    //     }


    // AND  DATE_FORMAT(created_at, '%Y') = DATE_FORMAT(CURRENT_DATE, '%Y') AND  
    async function getComparisonData() {
        return await db.sequelize.query(`SELECT
	DATE(created_at) as policy_date,
     MONTH(created_at) AS month,
	agent_id,
	agency_id ,status,
	COUNT(*) as row_count
FROM
	policies
WHERE
	YEAR(created_at) = YEAR(CURDATE())
 AND  status = 1 AND (agent_id = ${userId})
GROUP BY
	DATE(created_at);`, { type: db.sequelize.QueryTypes.SELECT });

    }
    async function getOthersComparisonData() {
        return await db.sequelize.query(`SELECT
	DATE(created_at) as policy_date,
     MONTH(created_at) AS month,
	agent_id,
	agency_id ,status,
	COUNT(*) as row_count
FROM
	policies
WHERE
	YEAR(created_at) = YEAR(CURDATE())
 AND  status = 1 AND (agent_id = ${otherUserId})
GROUP BY
	DATE(created_at);`, { type: db.sequelize.QueryTypes.SELECT });

    }
    let data = []
    let myData = await getComparisonData();
    data = [...myData]
    if (otherUserId !== userId) {
        let otherData = await getOthersComparisonData();
        data = [...data, ...otherData]
    }

    console.log('AgentKYC', data)

    res.json({
        status: true,
        data: {
            data
        }
    });
});

module.exports = router;
