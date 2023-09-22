const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const collection = require('../services');
const mongoose = require('mongoose');
const pick = require('../../../utils/pick');

const getAllCollection = catchAsync(async (req, res) => {
    const userId = req.user?.id

    const { page, limit, filter, sort } = await pick(req.query, [
        'page',
        'limit',
        'filter',
        'sort'
    ])

    if (!userId) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, "userId is required field");
    }
    const notificationList = await collection.getCollectionService(page, limit, filter, sort, userId);
    if (notificationList.status) {
        sendResponse(res, httpStatus.OK, notificationList, null);
    } else {
        if (notificationList.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, notificationList.data)
        }
        else if (notificationList.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, notificationList.data)
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, notificationList);
        }
    }
});

module.exports = getAllCollection;

