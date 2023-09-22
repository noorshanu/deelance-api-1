const express = require('express');
const bookmarkController = require('../../modules/bookmark/controller')
const bookmarkValidation = require('../../modules/bookmark/bookmark.validation')
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');


const router = express.Router();

router.post('/add',  auth('manageUsers'), bookmarkController.addToBookMark);

router.get('/get/:ca/:nftno',  auth('manageUsers'), bookmarkController.getBookmarkCount);

router.get('/getcount', auth('manageUsers'), bookmarkController.getBookmarkCount);

router.get('/bookmarkArtwork',auth("manageUsers"),bookmarkController.getBookmarkedArtwork);


module.exports = router;

