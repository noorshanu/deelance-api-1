const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const getArtworkServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');
const {convertToJSON} = require('../../../utils/helper')

const getArtworkByCollectionId = catchAsync(async (req, res) => {

        const { page, limit, filter, sort } = await pick(req.query, [
            "page",
            "limit",
            "filter",
            "sort",
        ]);
        let filter_Json_data = filter ? convertToJSON(filter.query) : undefined;
        const {id} = await pick(req.params , ['id'])

        const getResults = await getArtworkServices.getArtworkByCollectionId(id,page,limit,filter_Json_data,sort);
        
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

module.exports = getArtworkByCollectionId