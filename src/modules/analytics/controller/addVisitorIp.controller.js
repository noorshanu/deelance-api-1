const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const visitorsModel = require("../visitor.model.js");
const addVisitorIp = catchAsync(async (req, res) => {
    const ipAddr = req.body.ipAddr;
        if (!ipAddr) {
            sendResponse(res, httpStatus.NOT_FOUND, null, "No IP FOUND");
            return
        }
        const respo =  await visitorsModel.updateOne(
            { ipAddr: ipAddr },
             { $inc: { visitCount: 1 }} ,
            { upsert: true } // Make this update into an upsert
          );
        if (respo) {
            sendResponse(res, httpStatus.OK, "", null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, "");
        }
    
});

module.exports = addVisitorIp