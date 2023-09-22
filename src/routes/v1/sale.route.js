const express = require('express');
const analyticsController  = require("../../modules/analytics/controller")
const validate = require('../../middlewares/validate');

const router = express.Router();
const auth = require('../../middlewares/auth');
const { addBuySale } = require('../../modules/analytics/validation');

router.post('/buy',auth('manageUsers'),validate(addBuySale),analyticsController.nftBuySale);
router.get('/top-creator',analyticsController.topSeller);
router.get('/top-projects',analyticsController.topProjects);
router.get('/top-buyer',analyticsController.topBuyer);
router.get('/top-seller',analyticsController.topSeller);
router.get('/sell-history',analyticsController.sellHistory);
router.get('/sales-count',analyticsController.salesCount);

module.exports = router;