const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const seriesServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const { generateTokenTracker } = require('../../../utils/generateTokenTracker');

const addArtwork = catchAsync(async (req, res) => {

    const {
        name,
        priceType,
        exterLink,
        desc,
        price,
        serviceFee,
        royalty,
        properties,
        
        assetUrl,
        assetType,
        ownerId,
        totalSupply,
        propsObj

    } = await pick(req.body, [
        "name",
        "priceType",
        "exterLink",
        "desc",
        "price",
        "serviceFee",
        "royalty",
        "properties",
        
        "assetUrl",
        "assetType",
        "ownerId",
        "totalSupply",
        "propsObj"
    ])
    const userId = req.user.id
    let token = name.toUpperCase().substring(0, 5)
    const insertResult = await seriesServices.addArtwork({
        name,
        priceType,
        exterLink,
        desc,
        price,
        serviceFee,
        royalty,
        properties,
        assetUrl,
        assetType,
        ownerId,
        totalSupply,
        propsObj,
        createdBy: userId,
        token
    });
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    }
    else if (insertResult.code == 400) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
    } else if (insertResult.code == 500) {
        sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            null,
            insertResult.data
        );
    } else {
        sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult);
    }

});

module.exports = addArtwork
