const express = require('express');
const validate = require('../../middlewares/validate');
const router = express.Router();
const analyticsController  = require("../../modules/analytics/controller")

const auth = require('../../middlewares/auth');

router.get('/get-allnftupdate', analyticsController.getAllNFTupdate)
router.post('/addwebip',analyticsController.addVisitorIp);
router.get('/getvisitor',analyticsController.getVisitorCount);
router.get('/statistics',analyticsController.getSalesHisory )

module.exports = router;