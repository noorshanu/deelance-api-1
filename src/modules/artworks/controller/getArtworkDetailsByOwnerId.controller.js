const httpStatus = require('http-status')
const catchAsync = require ('../../../utils/catchAsync')
const { sendResponse } = require('../../../utils/responseHandler')
const pick = require("../../../utils/pick")
const artworkServices = require("../services")

const getUserById = catchAsync( async(req, res)=>{

  const userId = req.user.id
 
  const {page, limit, } = await pick(req.query, ['page', 'limit' ])

  const getArtworkDetailById = await artworkServices.getArtworkDetailByOwnerId({userId, page, limit})
  if(getArtworkDetailById){
    sendResponse(res,httpStatus.OK, getArtworkDetailById, null)
  }else {
    if(artwork.code == 400){
     sendResponse(res,httpStatus.BAD_REQUEST,null,artwork);
    }else if(artwork.code == 500){
     sendResponse(res,httpStatus.INTERNAL_SERVER_ERROR,null,artwork)
    }else{
     sendResponse(res,httpStatus.BAD_REQUEST,null,artwork)
    }
}
})

module.exports = getUserById
