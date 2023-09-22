const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const followerServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const deleteFollower = catchAsync(async (req, res) => {
    const { followerId  } = await pick(req.body, ['followerId'])
    const userId= req.user?.id;
    const insertResult = await followerServices.deleteFollower({
        userId, followerId
    });

    if (insertResult.status) {
        sendResponse(res, httpStatus.OK, insertResult.data, null);
    } else {
        if(insertResult.code == 400){ 
        sendResponse(res, httpStatus.BAD_REQUEST, null, insertResult.data);
        }else if (insertResult.code == 500){
            sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,insertResult.data);
        }else{
            sendResponse(res,httpStatus.BAD_REQUEST,null,insertResult)
        }
}
});

module.exports = deleteFollower
