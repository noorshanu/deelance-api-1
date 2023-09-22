const express = require('express');
const validate = require('../../middlewares/validate');
const artworkController = require('../../modules/artworks/controller');
const Artworkvalidation = require('../../modules/artworks/validation')
const auth = require('../../middlewares/auth');


const router = express.Router();

router.post('/addartwork', auth('manageUsers'), validate(Artworkvalidation.addArtwork), artworkController.addArtwork);

router.get('/search', artworkController.searchArtwork);

router.get('/myartwork', auth("manageUsers"), artworkController.getArtworkDetailsByOwnerId)

router.post('/approve', auth("manageUsers"), artworkController.deployNft)

router.get('/getartworkbycollectionid/:id', auth('manageUsers'), validate(Artworkvalidation.getArtworkById), artworkController.getArtworkByCollectionId)

router.get('/getartworkbyid/:id', auth('manageUsers'), validate(Artworkvalidation.getArtworkById), artworkController.getArtworkById);

router.get('/getAllartWorkbyUserId', auth("manageUsers"), validate(Artworkvalidation.listCategory), artworkController.getArtworkByUserId);

router.get('/getAllhiddenartWork', auth("manageUsers"), validate(Artworkvalidation.listCategory), artworkController.getMyAllHiddenArtwork);

router.get('/getLatestupdatedArtwork', auth("manageUsers"), validate(Artworkvalidation.listCategory), artworkController.getLatestUpdatedArtwork);

router.get('/addVisitorCount/:id', artworkController.addVisitorCount)

router.get('/getVisitorCount/:id', artworkController.getVisitorCount)

router.put('/update/:id', auth('manageUsers'), artworkController.updateDepArtwork)

router.put('/:id', auth('manageUsers'), validate(Artworkvalidation.updateArtwork), artworkController.updateArtwork);

router.get("/getmyArtwork", auth("manageUsers"), validate(Artworkvalidation.list), artworkController.getMyArtwork);
module.exports = router;

