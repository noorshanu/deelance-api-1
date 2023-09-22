const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getSalesHisory = catchAsync(async (req, res) => {
        const getResults = await analyticsService.getSalesHisory();
       
        if (getResults.status) {
            sendResponse(res, httpStatus.OK, getResults.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        }
    
});

module.exports = getSalesHisory