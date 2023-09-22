const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { convertToJSON } = require("../../../utils/helper");
const getAllRecordServices = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");

const getAllRecord = catchAsync(async (req, res) => {
  const { page, limit, sort, filter } = await pick(req.query, [
    "page",
    "limit",
    "sort",
    "filter",
  ]);
  const userId = req.user.id
  const filter_data = filter ? convertToJSON(filter.query) : '';

  const result = await getAllRecordServices.getAllLoginRecord(
    page,
    limit,
    filter_data,
    sort,
    userId
  );
  if (result) {
    sendResponse(res, httpStatus.OK, result, null);
  } else {
    if (result.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result.data);
    } else if (result.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, result.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, result);
    }
  }
});

module.exports = getAllRecord;
