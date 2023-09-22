const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const getSalesGraphServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const salesGraph = catchAsync(async (req, res) => {


    /* Default get last one month reports */
    let currentDate = new Date((new Date()).setHours(23, 59, 59))
    let oneMonthAgo = new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0, 0, 0, 0))

    let { fromDate = oneMonthAgo, toDate = currentDate } = await pick(req.query, ['fromDate', 'toDate'])

    let filter = { active: true, }
    /* set hours */
    if (fromDate && toDate) {
        filter['createdAt'] = {
            '$gte': new Date(new Date(fromDate).setHours(0, 0, 0, 0)),
            '$lte': new Date(new Date(toDate).setHours(23, 59, 59))
        }
    }

    const getResults = await getSalesGraphServices.salesGraph(filter);
    if (getResults.status) {
        sendResponse(res, httpStatus.OK, getResults.data, null);
    }
    else {
        if (getResults.code == 400) {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
        } else if (getResults.code == 500) {
            sendResponse(
                res,
                httpStatus.INTERNAL_SERVER_ERROR,
                null,
                getResults.data
            );
        } else {
            sendResponse(res, httpStatus.BAD_REQUEST, null, getResults);
        }
    }

});

module.exports = salesGraph