const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const seriesServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const addTransaction = catchAsync(async (req, res) => {

    try {
        const { 
            artworkId,
            creatorId,
            userId,
            sellerId,
            collectionId,
            price,
            currency,
         } = await pick(req.body, [
            "artworkId",
            "creatorId",
            "userId",
            "sellerId",
            "collectionId",
            "price",
            "currency",
        ])
        const insertResult = await seriesServices.addTransaction({
            artworkId,
            creatorId,
            userId,
            sellerId,
            collectionId,
            price,
            currency,
        });
        if (insertResult.status) {
            sendResponse(res, httpStatus.OK, insertResult.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data || "Bad Request");
        }
    } catch (error) {
        console.log(error);
        sendResponse(res, httpStatus.BAD_REQUEST, null, "Bad Request");
    }
    
});

module.exports = addTransaction
