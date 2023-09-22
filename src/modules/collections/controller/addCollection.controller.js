const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const seriesServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const addCollection = catchAsync(async (req, res) => {
    try {
        const {
            name,
            intro,
            logo,
            token,
            categoryId,
            createdBy,
            launchDate,
            contractAddress
        } = await pick(req.body, [
            'name',
            'intro',
            'logo',
            'token',
            'categoryId',
            'createdBy',
            'launchDate',
            'contractAddress'
        ])
        const insertResult = await seriesServices.addCollection({
            name,
            intro,
            logo,
            token,
            categoryId,
            createdBy,
            launchDate,
            contractAddress
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

module.exports = addCollection
