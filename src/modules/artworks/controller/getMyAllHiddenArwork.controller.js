const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const getArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getMyAllHiddenArwork = catchAsync(async (req, res) => {

        const userId = req.user.id;
        const {page, limit,  filter, sort} = await pick(req.query, ['page', 'limit', 'filter', 'sort'])

        const getResults = await getArtworkServices.getMyAllHiddenArwork(page, limit, filter, sort,userId);
       
        if (getResults.status) {
            sendResponse(res, httpStatus.OK, getResults.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        }
    
});

module.exports = getMyAllHiddenArwork