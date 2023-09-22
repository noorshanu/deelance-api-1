const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const updateArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const updateArtwork = catchAsync(async (req, res) => {

    const { id } = await pick(req.params, ['id'])
    const {
        name,
        launchDate,
        contractAddress,
        priceType,
        exterLink,
        desc,
        price,
        serviceFee,
        royalty,
        properties,
        collectionId,
        assetUrl,
        assetType,
        editionNo
    } = await pick(req.body, [
        "name",
        "launchDate",
        "contractAddress",
        "priceType",
        "exterLink",
        "desc",
        "price",
        "serviceFee",
        "royalty",
        "properties",
        "collectionId",
        "assetUrl",
        "assetType",
        "editionNo",
    ])
    const insertResult = await updateArtworkServices.updateArtwork(id, {
        name,
        launchDate,
        contractAddress,
        priceType,
        exterLink,
        desc,
        price,
        serviceFee,
        royalty,
        properties,
        collectionId,
        assetUrl,
        assetType,
        editionNo,
    });
    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    }
    else {
        if (insertResult.code == 400) {
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
    }
});

module.exports = updateArtwork
