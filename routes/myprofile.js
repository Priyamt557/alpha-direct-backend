var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');


router.post('/', async function (req, res, next) {

    const { userId, userEmail } = req.body;
    if (!userId || !userEmail) return res.json({
        status: false,
        data: {
            message: 'invalid request'
        }
    })

    async function getMyData() {
        return await db.sequelize.query(`SELECT address,email FROM users join user_profile on user_profile.user_id = users.id WHERE users.id = '${userId}';`, { type: db.sequelize.QueryTypes.SELECT });

    }

    let data = await getMyData()
    let foundProfile = data[0];

    if (foundProfile) {
        if (foundProfile?.email === userEmail) {
            return res.json({
                status: true,
                data: foundProfile
            });
        } else {
            return res.json({
                status: false,
                data: {
                    "message": "Invalid data",
                }
            });
        }

    } else {
        res.json({
            status: false,
            data: {
                "message": "Invalid data no user found with this data"
            }
        });
    }


});

module.exports = router;