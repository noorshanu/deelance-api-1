const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getAllNFTupdate = catchAsync(async (req, res) => {

       
        const {page, limit,  filter, sort} = await pick(req.query, ['page', 'limit', 'filter', 'sort'])

        const getResults = await analyticsService.getAllNFTupdate(page, limit, filter, sort);
       
        if (getResults.status) {
            sendResponse(res, httpStatus.OK, getResults.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        }
    
});

module.exports = getAllNFTupdate