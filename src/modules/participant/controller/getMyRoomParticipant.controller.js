const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const  {getMyRoomParticipants} = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getMyRoomParticipantController = catchAsync(async (req, res) => {
  const userId = '64b2789d0b65ca4f704f8935';
  try {
    const participantList = await getMyRoomParticipants({userId});
    
    sendResponse(res, httpStatus.OK, 'Participant list retrieved successfully', participantList);
  } catch (error) {
    sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, error.message);
  }
});

module.exports = getMyRoomParticipantController;
