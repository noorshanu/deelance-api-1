const express = require('express');
const messagesController = require('../../modules/messages/controller');
const auth = require('../../middlewares/auth');
const messageValidation = require('../../modules/messages/message.validation')
const validate = require('../../middlewares/validate')


router = express.Router();

router.post('/addMessage', auth('manageUsers'), validate(messageValidation.addMessage), messagesController.addMessage);
router.get('/getUserChats', auth('manageUsers'), messagesController.getUserChats);

router.get('/getMessagesByRoom/:roomId', auth('manageUsers'), messagesController.getmessageByRoom);

module.exports = router;
