var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');
const goals = require('../constants');






// constants
const currentStartOfMonth = moment().clone().startOf('month').format('YYYY-MM-DD');
const currentEndOfMonth = moment().clone().endOf('month').format('YYYY-MM-DD');
const currentTodayDate = moment().clone().startOf('Day').format('YYYY-MM-DD');
var findData = {
    'from_date': currentStartOfMonth,
    'to_date': currentEndOfMonth,
    'forAction': 'This Month',
}


function generateDailyMessage(sales, isCompletedAnyLevel, endingRange, bonuss) {
    if (sales === 0) {
        return `You did 0 sales today. That's alright, we know you worked hard! Take a rest for a fresh start tomorrow. Good Luck!`
    } else if (sales > 0 && isCompletedAnyLevel === false && sales < endingRange) {
        return `You did ${sales} sales today. Almost there!, Try to reach ${endingRange} tomorrow and you'll get a bonus of ${bonuss}`
    } else if (sales === endingRange) {
        return `You did ${sales} sales today, Wow, you're a beast! You'll get a bonus of ${bonuss}, Congrats, keep up the good work tomorrow!`
    }
    else if (sales > 0 && isCompletedAnyLevel === true) {
        return `You did ${sales} sales today, Wow, you're a beast! You'll get a bonus of ${bonuss}, Congrats, keep up the good work tomorrow!`
    }


}
/* get dashboard data. */
router.get('/', async function (req, res, next) {

    async function get_data() {
        return await db.sequelize.query(`SELECT users.id, users.firstName, user_profile.cellphone,
            (SELECT COUNT(*) FROM policies WHERE policies.agent_id = users.id
 AND policies.status = 1 AND DATE(policies.created_at) = CURDATE()) AS row_count
FROM users
INNER JOIN user_profile ON users.id = user_profile.user_id
INNER JOIN policies ON policies.agent_id = users.id
WHERE users.agency_id = 22
GROUP BY users.id;`, { type: db.sequelize.QueryTypes.SELECT });
    }

    let data = await get_data();
    const ids = ['d1', 'd2', 'd3', 'd4', 'd5'];

    let result = []
    data.filter((item, index) => {
        if (item?.row_count > 0) {
            let resulting_item = { ...item };
            for (let i in goals) {
                let goal_item = goals[i];
                if (ids.includes(goal_item?.id)) {
                    if (item?.row_count >= goal_item?.starting_from && item?.row_count <= goal_item?.ending_at) {
                        let message = generateDailyMessage(item?.row_count, goal_item?.isCompletedAnyLevel, goal_item?.ending_at, goal_item?.bonus);
                        resulting_item = { ...resulting_item, message: message }
                    }
                }
            }
            result.push(resulting_item);
        }
    })
    res.json({
        status: true,
        data: {
            result
        }
    });
});

module.exports = router;
