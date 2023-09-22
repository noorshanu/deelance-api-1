const express = require('express');

const chatRoomController = require('../../modules/chat/controller');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/addchatroom',auth('manageUsers'),chatRoomController.addChatRoom);
router.post('/mychatlist',/* auth('manageUsers'), */chatRoomController.getUserSidebarChats);



module.exports = router;