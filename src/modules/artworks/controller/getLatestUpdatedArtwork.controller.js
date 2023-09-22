const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const getArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getLatestUpdatedArtwork = catchAsync(async (req, res) => {

       
        const {page, limit,  filter } = await pick(req.query, ['page', 'limit', 'filter' ])

        const getResults = await getArtworkServices.getLatestUpadateArtwork(page, limit, filter);
       
        if (getResults.status) {
            sendResponse(res, httpStatus.OK, getResults.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        }
    
});

module.exports = getLatestUpdatedArtwork