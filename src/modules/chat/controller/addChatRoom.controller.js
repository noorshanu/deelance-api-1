const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const chatRoomService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const addChatRoom = catchAsync(async (req, res) => { 
    const participantId = '64b2746344e9571c88a0e595' ||req.body.participantId;
    const  roomId  = "rat123"||req.body.roomId; // Extract roomId from the request body
    const userId = "64b13839955600413410111a"||req.user.id;
    const responseData = await chatRoomService.addChatRoom({roomId, userId, participantId});
   /* 64b2746344e9571c88a0e595 */
    
    if (responseData.status) {
        sendResponse(res, httpStatus.OK, responseData.data, null);
    } else {
        if (responseData.code === 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, responseData.data);
        } else {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, responseData.data);
        }
    }
});

module.exports = addChatRoom;



