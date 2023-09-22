const express = require('express');
const validate = require('../../middlewares/validate')
const collectionValidation = require('../../modules/auction/validation');
const  auctionController  = require('../../modules/auction/controller');
const auth = require('../../middlewares/auth');


router = express.Router();

router.post('/create' ,auth('manageUsers'), validate(collectionValidation.addAuction), auctionController.addAuction);

router.get('/getartwork/:id',validate(collectionValidation.getArtworkById),auctionController.getArtworkById)


module.exports = router;
