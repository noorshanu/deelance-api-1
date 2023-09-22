const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { addParticipant } = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const chatroomModel = require('../../chat/chatRoom.model');
const participantModel = require('../participant.model');

const addParticipantController = catchAsync(async (req, res) => {
  const { roomId } = req.body;
  const userId = req.user.id;
  


  try {
    // Check if chat room exists

   
    const chatRoom = await chatroomModel.findOne({ chatRoomId: roomId });

    if (!chatRoom) {
      sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid roomId');
      return;
    }

    // Check if participant already exists in the room
    const existingParticipant = await participantModel.findOne({
      roomId,
      userId,
    });
 
    if (existingParticipant) {
      const existingParticipant = await addParticipant(userId, roomId);
      sendResponse(res, httpStatus.OK, "Participant added Successfully", existingParticipant.data)
    return;
    }

    // Add participant to the room
    const addResult = await addParticipant(userId, roomId);
    console.log(addResult);
    sendResponse(res, httpStatus.OK, 'Participant added successfully', addResult.data);
  } catch (error) {
    sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, "Not found---",error.message);
  }
});

module.exports = addParticipantController;
