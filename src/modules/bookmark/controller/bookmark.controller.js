const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const bookmarkServices = require('../services');
const mongoose = require('mongoose');

const addToBookMark = catchAsync(async (req, res) => {
    let userId = req.user?.id;
    let contAddr = req.body.contAddr || null;
    let nftNo = req.body.nftNo || null;

    if (!contAddr || !nftNo) {
        return sendResponse(res, httpStatus.BAD_REQUEST, null, "artworkId  is required");
    }

    let bookMarkData = { 
        userId: mongoose.Types.ObjectId(userId), 
        contAddr: contAddr,
        nftNo:nftNo
     };

    const insertResult = await bookmarkServices.addToBookMarkService(bookMarkData);
    if (insertResult.status && insertResult.code ==201) {
        return sendResponse(res, httpStatus.OK, { msg: insertResult.msg}, null);
    } else  if(insertResult.status && insertResult.code ==200){
        sendResponse(res, httpStatus.OK, { msg: insertResult.msg}, null);
    }else{
        sendResponse(res, httpStatus.BAD_REQUEST, { msg: "Not found"}, null);
    }
});

module.exports = addToBookMark;
