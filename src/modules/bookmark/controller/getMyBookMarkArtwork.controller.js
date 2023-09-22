const httpStatus = require("http-status");
const catchAsync = require("../../../utils/catchAsync");
const BookServices = require("../services");
const { sendResponse } = require("../../../utils/responseHandler");
const pick = require("../../../utils/pick");

const getBookMarkArtwork = catchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    const {page, limit} = await pick(req.query, ['page', 'limit'])

    const getResults = await  BookServices.getMyBookmarkArtwork({userId,page,limit});
    if (getResults.status) {
      sendResponse(res, httpStatus.OK, getResults.data, null);
    } else {
      sendResponse(
        res,
        getResults.code == 404
          ? httpStatus.NOT_FOUND
          : getResults.code == 500
          ? httpStatus.INTERNAL_SERVER_ERROR
          : httpStatus.BAD_REQUEST,
        null,
        getResults || "Bad Request"
      );
    }
  } catch (error) {
    console.log(error);
    sendResponse(res, httpStatus.BAD_REQUEST, null, "Bad Request");
  }
});

module.exports = getBookMarkArtwork;
