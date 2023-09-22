const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const analyticsServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const salesCount = catchAsync(async (req, res) => {
	const getResults = await analyticsServices.salesCount();
	if (getResults.status) {
		sendResponse(res, httpStatus.OK, getResults.data, null);
	}
	else {
		sendResponse(res, httpStatus.BAD_REQUEST, null, getResults.data);
	}

});

module.exports = salesCount
