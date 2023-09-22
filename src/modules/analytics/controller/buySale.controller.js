const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const nftBuySale = catchAsync(async (req, res) => {

        let body = req.body;
        let payload = {...body,buyerId:req.user.id}
        const getResults = await analyticsServices.nftBuySale(payload);
        if (getResults.status) {
            sendResponse(res, httpStatus.OK, getResults.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        }
    
});

module.exports = nftBuySale