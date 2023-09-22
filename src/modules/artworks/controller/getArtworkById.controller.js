const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const getArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getArtworkById = catchAsync(async (req, res) => {

        const {id} = await pick(req.params , ['id'])

        const getResults = await getArtworkServices.getArtworkById(id);
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

module.exports = getArtworkById