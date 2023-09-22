const httpStatus = require('http-status');
const catchAsync = require('../../../utils/catchAsync');
const categoryServices = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const pick = require('../../../utils/pick');

const getAllCategory = catchAsync(async (req, res) => {
    const {page, limit,  filter, sort} = await pick(req.query, ['page', 'limit', 'filter', 'sort'])

    const list = await categoryServices.getAllCategory(page, limit, filter, sort);
    if (list.status) {
      sendResponse(res, httpStatus.OK, list, null);
    } else {
      if(list.code == 400){
        sendResponse(res,httpStatus.BAD_REQUEST,null,list.data)
      }
      else if(list.code == 500){
        sendResponse(res,httpStatus,INTERNAL_SERVER_ERROR,null,list.data)
      }
      else{
      sendResponse(res, httpStatus.BAD_REQUEST, null, list);
    }
  }
});

module.exports = getAllCategory
