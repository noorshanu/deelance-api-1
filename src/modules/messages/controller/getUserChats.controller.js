const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const messageServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getUserChats = catchAsync(async (req, res) => {
    const UserId = req.user.id;
    try {
        const userChats = await messageServices.getUserChats(UserId);
        sendResponse(res, httpStatus.OK, userChats, null);
    } catch (error) {
        console.error(error);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Server Error');
    }
});

// const getChatMessages = catchAsync(async (req, res) => {
//     const { selectedUserId } = req.params;
//     const currentUserId = req.user.id;
//     try {
//         const chatMessages = await messageServices.getChatMessages(currentUserId, selectedUserId);
//         sendResponse(res, httpStatus.OK, chatMessages, null);
//     } catch (error) {
//         console.error(error);
//         sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, 'Server Error');
//     }
// });

module.exports = getUserChats
    // getChatMessages,

