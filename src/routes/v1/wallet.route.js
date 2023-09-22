const express = require('express');
const validate = require('../../middlewares/validate');
const router = express.Router();
const walletController  = require("../../modules/wallets/controller")
const walletValidation = require("../../modules/wallets/wallets.validation");
const auth = require('../../middlewares/auth');



router.post('/add-wallet',validate(walletValidation.addWallets),auth('manageUsers'), walletController.addWallets);





module.exports = router;