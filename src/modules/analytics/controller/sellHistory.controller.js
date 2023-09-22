const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const sellHistory = catchAsync(async (req, res) => {

        let body = req.body;
        const getResults = await analyticsServices.sellHistory(body);
        if (getResults.status) {
            sendResponse(res, httpStatus.OK, getResults.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        }
    
});

module.exports = sellHistory
