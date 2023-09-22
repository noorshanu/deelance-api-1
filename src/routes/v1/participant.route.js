const express = require('express');

const participantController = require('../../modules/participant/controller');

const router = express.Router();
const auth = require('../../middlewares/auth');

router.post('/addparticipant',auth('manageUsers'),participantController.addParticipantController);
router.post('/getmyroomparticipants',auth('manageUsers'), participantController.getMyRoomPartcipantController)

module.exports = router;