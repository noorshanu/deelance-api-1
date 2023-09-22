const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const notificationServices = require('../services');
const mongoose = require('mongoose');
const pick = require('../../../utils/pick');
const moment = require('moment/moment');

const getAllNotification = catchAsync(async (req, res) => {
    const userId = req.user.id

    const { timeRange, page, limit, filter, sort } = await pick(req.query, [
        'timeRange',
        'page',
        'limit',
        'filter',
        'sort'

    ])
    let filters = filter ? (filter) : undefined;
    let startDate, endDate;

    if (timeRange === "seven-days") {
        startDate = moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD');
        endDate = moment(new Date()).format('YYYY-MM-DD');
    }
    else if (timeRange == 'today') {

        startDate = moment(new Date()).format('YYYY-MM-DD');
        endDate = moment(new Date()).format('YYYY-MM-DD');


    }

    const notificationList = await notificationServices.getAllNotificationService(startDate, endDate, page, limit, filters, sort, userId);
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

module.exports = getAllNotification;

