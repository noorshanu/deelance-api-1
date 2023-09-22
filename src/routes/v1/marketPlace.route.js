const express = require('express');
const  marketPlaceController  = require('../../modules/marketPlace/controller');
const auth = require('../../middlewares/auth');


router = express.Router();

router.get('/getAllArtwork' ,auth('manageUsers'), marketPlaceController.getAllArtwork);



module.exports = router;
