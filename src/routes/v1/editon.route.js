const express = require('express');
const validate = require('../../middlewares/validate');
const router = express.Router();
const editionsController  = require("../../modules/editions/controller")
const editionvalidation = require('../../modules/editions/validation')
const auth = require('../../middlewares/auth');


router.get('/getAllEdition',auth('manageUsers'),validate(editionvalidation.list) ,editionsController.getEditions);
router.get('/getAllEdition',auth('manageUsers'),editionsController.getEditions);
router.put('/list/:id', auth('manageUsers'),editionsController.listEditionById);
router.put('/unlist/:id', auth('manageUsers'),editionsController.unlistEditionById);

module.exports = router;