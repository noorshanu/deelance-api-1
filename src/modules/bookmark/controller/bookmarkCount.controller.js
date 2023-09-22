const httpStatus = require('http-status')
const bookmarkCountServices = require('../services');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const bookmark = require('../bookmark.model');
const mongoose = require("mongoose");


const getBookmarkCount = catchAsync(async (req, res) => {
    try {
        const contractAddr = req.params?.ca;
        const nftno = req.params?.nftno;
        const userId =req.user.id;
        // console.log(contractAddr,nftno);
        const regexName = new RegExp(`^${contractAddr}$`, 'i');
        const list = await bookmark.findOne({userId:mongoose.Types.ObjectId(userId),contAddr:regexName,nftNo:nftno})
        if (list) {
            sendResponse(res, httpStatus.OK, list, null)
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, "Data Not found")
        }
    } catch (error) {
        sendResponse(res, httpStatus.BAD_REQUEST, null, "Data Not found")
    }

})


module.exports = getBookmarkCount

