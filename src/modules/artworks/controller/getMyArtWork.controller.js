const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const artWorkServices = require('../services');
const mongoose = require('mongoose');
const pick = require('../../../utils/pick');

const getMyArtWorks = catchAsync(async (req, res) => {
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
    const myArtworkList = await artWorkServices.getMyArtWork(page, limit, filter, sort, userId);
    if (myArtworkList.status) {
        sendResponse(res, httpStatus.OK, myArtworkList, null);
    }
    else if (myArtworkList.code == 400) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, myArtworkList.data)
    }
    else if (myArtworkList.code == 500) {
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, myArtworkList.data)
    }
    else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, myArtworkList);
    }

});

module.exports = getMyArtWorks;

