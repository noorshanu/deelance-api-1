const express = require('express');
const validate = require('../../middlewares/validate');
const TransactionController = require('../../modules/transactions/controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.get('/topseller', auth('manageUsers'),TransactionController.getTopseller);
router.get('/topbuyer',auth('manageUsers'), TransactionController.getTopBuyer );
router.get('/topcreator',auth('manageUsers'), TransactionController.getTopCreator);
router.get('/salesgraph', auth('manageUsers'),TransactionController.salesGraph);

router.post('/addTransaction', TransactionController.addTransaction);

module.exports = router;

