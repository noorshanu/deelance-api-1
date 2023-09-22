const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const updateArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const updateDepArtwork = catchAsync(async (req, res) => {

    const { id } = await pick(req.params, ['id'])
    const {
        contractAddress,
        hash
    } = await pick(req.body, [
        "contractAddress",
        "hash"
    ])
    const insertResult = await updateArtworkServices.updateDepArtwork(id, {
        contractAddress,
        hash
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

module.exports = updateDepArtwork
