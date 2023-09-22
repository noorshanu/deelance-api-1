const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const auctionServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const getArtworkById = catchAsync(async (req, res) => {

  const { id } = await pick(req.params, ['id']);
  const { page, limit, sort, startDate, endDate } = await pick(req.query, ['page', 'limit', 'sort', 'startDate', 'endDate'])

  const artwork = await auctionServices.getArtworkById({ id, page, limit, sort, startDate, endDate });
  if (artwork.status) {
    sendResponse(res, httpStatus.OK, artwork, null);
  } else {
    if (artwork.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, artwork);
    } else if (artwork.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, artwork)
    } else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, artwork)
    }
  }
});

module.exports = getArtworkById
