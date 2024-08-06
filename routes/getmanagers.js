var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');


router.get('/', async function (req, res, next) {



    async function getMyData() {
        return await db.sequelize.query(`SELECT
    users.id,users.agency_id,users.firstName,users.lastName
FROM
     users
LEFT JOIN
     user_roles ON users.id = user_roles.user_id
LEFT JOIN
     roles ON roles.id = user_roles.role_id
WHERE
    users.active = 1 and roles.name like "%manager%";`, { type: db.sequelize.QueryTypes.SELECT });

    }

    let data = await getMyData()



    res.json({
        status: true,
        data:
            data
    });



});

module.exports = router;