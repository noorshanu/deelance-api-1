const express = require('express');
const validate = require('../../middlewares/validate');
const router = express.Router();
const followerController  = require("../../modules/follow/controller")
const followerValidation = require("../../modules/follow/follow.validation");
const auth = require('../../middlewares/auth');

router.post('/add-follower',auth('manageUsers'), validate(followerValidation.addFollower), followerController.addFollower);

router.delete('/delete',auth('manageUsers'), validate(followerValidation.deleteFollower), followerController.deleteFollower);

router.get('/follower',auth('manageUsers'),followerController.getMyFollowerCount);

router.get('/following',auth('manageUsers'),followerController.getMyFollowingCount);

router.get('/get-myFollower',auth('manageUsers'),followerController.getMyFollowerList);

router.get('/get-myFollowing',auth('manageUsers'),followerController.getMyFollwingList);




module.exports = router;