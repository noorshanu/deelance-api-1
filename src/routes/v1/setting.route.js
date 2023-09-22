const express = require('express');
const validate = require('../../middlewares/validate');
const {updateSettings, getSettingById} = require('../../modules/setting/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/update',auth('manageUsers'),updateSettings);

router.get('/getSettingById',auth('manageUsers'),getSettingById);

module.exports = router;
