var express = require('express');
var router = express.Router();
const db = require('../model');
const moment = require('moment');


router.post('/', async function (req, res, next) {
    const { userId } = req.body
    if (!userId) return res.json({ status: false, message: 'invalid call' })





    // get my compliance's 
    async function getMyCompliaceRating() {
        return await db.sequelize.query(`SELECT
   policies.id as policyId, customer_kyc.compliance
    from
    policies
INNER JOIN customer_kyc ON policies.customer_id = customer_kyc.customer_id
    WHERE
    agent_id = 1; `, { type: db.sequelize.QueryTypes.SELECT })
    }

    async function getKycComplaincesOfActivePolicies() {
        return await db.sequelize.query(`SELECT policies.status, policies.customer_id, policies.id as policyId, customer_kyc.compliance,  customer_kyc.status as customer_kyc_status FROM policies INNER JOIN customer_kyc ON policies.customer_id = customer_kyc.customer_id WHERE policies.agent_id = ${userId} AND customer_kyc.compliance = 1 AND policies.created_at >= DATE_SUB(CURDATE(), INTERVAL 1000 DAY);`, { type: db.sequelize.QueryTypes.SELECT })
    }


    async function getNonKycComplaincesOfActivePolicies() {
        return await db.sequelize.query(`SELECT policies.status, policies.customer_id, policies.id as policyId, customer_kyc.compliance,  customer_kyc.status as customer_kyc_status FROM policies INNER JOIN customer_kyc ON policies.customer_id = customer_kyc.customer_id WHERE policies.agent_id = ${userId} AND customer_kyc.compliance = 2 AND policies.created_at >= DATE_SUB(CURDATE(), INTERVAL 1000 DAY);`, { type: db.sequelize.QueryTypes.SELECT })
    }


    async function getPendingKycComplaincesOfActivePolicies() {
        return await db.sequelize.query(`SELECT policies.status, policies.customer_id, policies.id as policyId, customer_kyc.compliance,  customer_kyc.status as customer_kyc_status FROM policies INNER JOIN customer_kyc ON policies.customer_id = customer_kyc.customer_id WHERE policies.agent_id = ${userId} AND customer_kyc.compliance = 0 AND policies.created_at >= DATE_SUB(CURDATE(), INTERVAL 1000 DAY);`, { type: db.sequelize.QueryTypes.SELECT })
    }





    let complianceRating = await getMyCompliaceRating();
    let KycComplaincesOfActivePolicies = await getKycComplaincesOfActivePolicies();
    let NonKycComplaincesOfActivePolicies = await getNonKycComplaincesOfActivePolicies();
    let PendingKycComplaincesOfActivePolicies = await getPendingKycComplaincesOfActivePolicies()



    res.json({
        status: true,
        data: {
            complianceRating,
            KycComplaincesOfActivePolicies,
            NonKycComplaincesOfActivePolicies,
            PendingKycComplaincesOfActivePolicies
        }
    });



});

module.exports = router;