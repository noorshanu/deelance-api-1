const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const getTransactionServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const convertToJSON = require('../../../utils/helper')

const getTopseller = catchAsync(async (req, res) => {

    /* Default get last one month reports */
	let currentDate = new Date((new Date()).setHours(23, 59, 59))
	let oneMonthAgo = new Date(new Date(new Date().setMonth(new Date().getMonth() - 1)).setHours(0,0, 0,0))

    let {fromDate = oneMonthAgo, toDate = currentDate,page, limit,  filter, sort} = await pick(req.query, ['fromDate', 'toDate','page' , 'limit','filter', 'sort'])
    let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
    
    
    const getResults = await getTransactionServices.getTopseller(fromDate, toDate,page, limit,  filter_Json_data, sort);
    if (getResults.status) {
        sendResponse(res, httpStatus.OK, getResults, null);
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

module.exports = getTopseller