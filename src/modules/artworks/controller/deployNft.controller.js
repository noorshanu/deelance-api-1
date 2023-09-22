const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const artworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');

const approveArtWork = catchAsync(async (req, res) => {

  const { artworkId } = await pick(req.body, ['artworkId',]);
  const userId = req.user.id;

  let approvedArtwork = await artworkServices.deployNft({ artworkId ,userId});
  if (approvedArtwork.status) {
    sendResponse(res, approvedArtwork.code ==201 ? httpStatus.CREATED:httpStatus.OK, approvedArtwork.data, null);
  } else if (approvedArtwork.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, approvedArtwork.data);
    }
    else if (approvedArtwork.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, approvedArtwork.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, approvedArtwork.data);
    
  }
});


module.exports = approveArtWork