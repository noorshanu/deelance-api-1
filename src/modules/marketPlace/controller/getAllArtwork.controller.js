const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const pick = require("../../../utils/pick");
const { convertToJSON } = require("../../../utils/helper");
const marketPlaceService = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");

const getAllArtwork = catchAsync(async (req, res) => {
  const { page, limit, isSecondary, filter } = await pick(req.query, [
    "page",
    "limit",
    "isSecondary",
    "filter",
  ]);
  const userId = req.user.id
  const filter_data = filter ? convertToJSON(filter.query) : '';

  const list = await marketPlaceService.getALlArtwork(
    page,
    limit,
    isSecondary,
    filter_data,
    userId
  );
  if (list) {
    sendResponse(res, httpStatus.OK, list, null);
  } else {
    if (list.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list.data);
    } else if (list.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, list.data);
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, list);
    }
  }
});

module.exports = getAllArtwork;
