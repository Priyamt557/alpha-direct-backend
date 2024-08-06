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

/* get dashboard data. */
router.post('/', async function (req, res, next) {

  const { userId, agency_id } = req.body
  if (!userId || !agency_id) return res.json({ status: false, message: 'Invalid User' })













  // get agentKyc
  async function getAgentKyc() {
    return await db.sequelize.query(`SELECT u.*, up.profile_photo FROM users u JOIN user_profile up ON u.id = up.user_id WHERE u.agency_id = 1;`, { type: db.sequelize.QueryTypes.SELECT })
  }











  // code to get top agent from all the agent's of month

  let agentKYC = await getAgentKyc()








  res.json({
    status: true,
    data: {
      goals
      // agentKYC,

    }
  });
});

module.exports = router;
