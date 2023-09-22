const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const userService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const updateUserProfile = catchAsync(async (req, res) => {
    try {
        const body = req.body

        console.log(body);
        const userId = req.user.id;
        console.log(userId);


        const user = await userService.updateUserProfile(userId, body);
        if (user.status) {
            sendResponse(res, httpStatus.OK, user, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, user.data || "Bad Request");
        }
    } catch (error) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, "Bad Request");

    }
});

module.exports = updateUserProfile;
