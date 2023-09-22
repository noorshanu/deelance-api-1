const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const userService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const updateUserWallet = catchAsync(async (req, res) => {
    try {
        const body = req.body
        const userId = req.user.id;

        const resp = await userService.updateUserWallet(userId, body);
        if (resp.status && resp.code == 202) {
            sendResponse(res, httpStatus.ACCEPTED, resp, null);
        }else if(resp.status){
            sendResponse(res, httpStatus.OK, resp, null);
        }
        else if(resp.status && resp.code == 403){
            sendResponse(res, httpStatus.FORBIDDEN, resp.data, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, resp.data || "Bad Request");
        }
    } catch (error) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, "Bad Request");

    }
});

module.exports = updateUserWallet;
