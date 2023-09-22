const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const auctionServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const addAuction = catchAsync(async (req, res) => {

    const {artworkId,bidAmount,expiryDate,auctionType} = await pick(req.body, ['artworkId','bidAmount','expiryDate','userId', 'auctionType', ])
    const userId = req.user.id
    const insertResult = await auctionServices.addAuction({artworkId,bidAmount,expiryDate,userId,auctionType});
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        if(insertResult.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
        else if(insertResult.code == 500) {
            sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, insertResult.data);
        }
        else{
            sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }
    }
});

module.exports = addAuction
