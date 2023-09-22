const express = require('express');
const validate = require('../../middlewares/validate');
const router = express.Router();
const sellCountController  = require("../../modules/history/controller")
const categoryValidation = require("../../modules/category/category.validation");
const auth = require('../../middlewares/auth');



router.get('/top-sell',auth('manageUsers'), sellCountController.sellCount);
router.get('/get-AllDetail', sellCountController.getAllDetail);






module.exports = router;