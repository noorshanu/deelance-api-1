const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const visitorsModel = require("../visitor.model.js");
const getVisitorCount = catchAsync(async (req, res) => {
    
    const uniqueCreatorCount = await visitorsModel.aggregate([
        { $match: { } },
        {
            $group: {
                _id:  {
                    $dateToString: {
                      format: "%Y-%m-%d",  // ISO 8601 format with milliseconds and UTC time zone
                      date: "$createdAt"  // Replace "timestamp" with the actual field name
                    }
                  }, 
                visitCount: { $sum: "$visitCount" } // Count the number of students for each subject
            }
        },
     
    ]);
        if (uniqueCreatorCount) {
            sendResponse(res, httpStatus.OK, uniqueCreatorCount, null);
        }
        else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, "");
        }
    
});

module.exports = getVisitorCount