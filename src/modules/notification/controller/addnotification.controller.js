const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const notificationServices = require('../services');
const mongoose = require('mongoose');
const pick = require('../../../utils/pick');

const addNotification = catchAsync(async (req, res) => {
    try {
        const { type, message, receiverId } = await pick(req.body, ['type', 'message', 'receiverId'])

        const userId = req.user?.id;

        if (!receiverId) {
            return sendResponse(res, httpStatus.BAD_REQUEST, null, "receiver Id is required");
        }
        const notificationData = {
            receiverId: mongoose.Types.ObjectId(receiverId),
            type: type,
            message
        };

        const notificationResult = await notificationServices.addNotificationService(notificationData);

        if (notificationResult.status) {
            return sendResponse(res, httpStatus.CREATED, { msg: message, notification: notificationResult?.notificationRes }, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, notificationResult.data || "Bad Request");
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, httpStatus.BAD_REQUEST, null, "Bad Request");

    }
});

module.exports =
    addNotification;

