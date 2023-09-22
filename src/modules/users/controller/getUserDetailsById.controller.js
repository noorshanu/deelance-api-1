const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const userService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getUserDetailsById = catchAsync(async (req, res) => {
    try {

        
        let {id}  = await pick(req.params, ["id"]);
 
        const user = await userService.getUserDetailById(id);
        console.log(id)
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

module.exports = getUserDetailsById;
