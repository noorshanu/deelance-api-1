const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const followerServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getMyFollowerList = catchAsync(async (req, res) => {
    
    const userId= req.user?.id;
    const insertResult = await followerServices.getMyFollowerList(
        userId
    );

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

module.exports = getMyFollowerList
