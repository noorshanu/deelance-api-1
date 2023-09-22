const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const moment = require('moment/moment');


const BuyerProjects = catchAsync(async (req, res) => {

    const { timeRange, page, limit, filter, sort } = await pick(req.query, [
        'timeRange',
        'page',
        'limit',
        'filter',
        'sort'

    ])

    let startDate, endDate;

    if (timeRange === "weekly") {
        startDate = moment(new Date()).subtract(7, 'days').format('YYYY-MM-DD');
        endDate = moment(new Date()).format('YYYY-MM-DD');
    }
    let body = req.body;
    const getResults = await analyticsServices.topBuyers(startDate, endDate, page, limit, filter, sort);
    if (getResults.status) {
        sendResponse(res, httpStatus.OK, getResults.data, null);
    }
    else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
    }

});

module.exports = BuyerProjects
