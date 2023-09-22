const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const loginRecordServices = require('../services');
const mongoose = require('mongoose');
const pick = require('../../../utils/pick');

const addLoginRecord = catchAsync(async (req, res) => {
	const { browser, platform, location = "" } = await pick(req.body, ['browser', 'platform', 'location'])
	const addResult = await loginRecordServices.addLoginRecord({ browser, platform, location });
	if (addResult?.status) {
		return sendResponse(res, httpStatus.CREATED, addResult?.data, null);
	} else {
		return sendResponse(res,
			addResult?.code == 500 ? httpStatus.INTERNAL_SERVER_ERROR : httpStatus.BAD_REQUEST,
			null,
			addResult?.msg
		);
	}
});

module.exports = addLoginRecord;