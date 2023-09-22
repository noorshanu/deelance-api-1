const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const catchAsync = require('../../../utils/catchAsync');
const messageService = require('../services');
const { sendResponse } = require('../../../utils/responseHandler');
const { convertToJSON } = require("../../../utils/helper");

const getMessagesByRoom = catchAsync(async (req, res) => {

  const {  roomId } = await pick(req.params, ["roomId"]);
  console.log(roomId)
  const result = await messageService.getmessagesByRoomId(roomId) ;
     if (result.status) {
     sendResponse(res, httpStatus.OK, result, null);
      } else {
         if(result.code == 400){
          sendResponse(res,httpStatus.BAD_REQUEST,null,result);
         }else if(result.code == 500){
          sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,result)
         }else{
          sendResponse(res,httpStatus.BAD_REQUEST,null,result)
         }
  }
});

module.exports = getMessagesByRoom
