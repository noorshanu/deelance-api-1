const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const updateArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const searchArtwork = catchAsync(async (req, res) => {
    const { keyword } = await pick(req.query, ['keyword'])
   
    const response = await updateArtworkServices.searchArtwork({ keyword });
    if (response.status) {
        sendResponse(res, httpStatus.OK, response.data, null);
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, []);

    }
});

module.exports = searchArtwork;