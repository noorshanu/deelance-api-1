const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const { sendResponse } = require('../../../utils/responseHandler');
const categoryServices = require('../services');

const updateCategory = catchAsync(async (req, res) => {
  const { id,  } = await pick(req.params, ['id'])

  const {  name, tag } = await pick(req.body, [ 'name', 'tag'])
 
  const dataObj = {}
    if(name){
      dataObj.name = name
    }
    if(tag){
      dataObj.tag = tag
    }
  const updateResult = await categoryServices.updateCategory(id, dataObj);
   if (updateResult.status) {
    sendResponse(res, httpStatus.OK, updateResult, null);
  } else {
    if (updateResult.code == 400) {
      sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
    }
    else if (updateResult.code == 500) {
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, null, updateResult.data);
    }
    else {
      sendResponse(res, httpStatus.BAD_REQUEST, null, updateResult.data);
    }
  }
});

module.exports = updateCategory
