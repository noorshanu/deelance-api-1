const express = require('express');
const  loginActivityController  = require('../../modules/loginActivity/controllers');
const auth = require('../../middlewares/auth');
const loginActivityValidation = require('../../modules/loginActivity/validations')
const validate = require('../../middlewares/validate')


router = express.Router();

router.post('/add-login-record' , validate(loginActivityValidation.addLoginRecord), loginActivityController.addLoginRecord);

router.get('/get-all-record',auth("manageUsers"),validate(loginActivityValidation.getAllLoginActivity), loginActivityController.getAllLoginRecord)

router.delete('/delete-record/:recordId',auth("manageUsers"),validate(loginActivityValidation.deleteLoginActivity), loginActivityController.deleteLoginActivityRecord)

module.exports = router;
