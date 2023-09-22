const httpStatus = require('http-status');
const catchAsync = require('./../../../utils/catchAsync');
const userService = require('./../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');


const updateUserStatus = catchAsync(async (req, res) => {
    console.log("dsfsdfsdf");
    const { id } = await pick(req.params, ['id'])
    const { isBlock, remark } = await pick(req.body, ['isBlock', 'remark'])
    console.log(req.body);
    const user = await userService.updateUserStatus(id, { isBlock, remark });
    console.log(user)

    if (user.status) {
        sendResponse(res, httpStatus.OK, user, null);
    } else {
        if (user.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, user.data)
        }
        else if (user.code == 500) {
            sendResponse(res, httpStatus, INTERNAL_SERVER_ERROR, null, user.data)
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, user.data);
        }
    }
})

module.exports = updateUserStatus 