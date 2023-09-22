const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const collectionService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const approveCollection = catchAsync(async (req, res) => {

  const { collectionId } = await pick(req.params, ['collectionId',]);

  let approvedCollection = await collectionService.approvedCollection(collectionId);
  if (approvedCollection.status) {
    sendResponse(res, httpStatus.OK, approvedCollection.data, null);
  } else {
    if (approvedCollection.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, approvedCollection.data);
    }
    else if (approvedCollection.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, approvedCollection.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, approvedCollection.data);
    }
  }
});


module.exports = approveCollection