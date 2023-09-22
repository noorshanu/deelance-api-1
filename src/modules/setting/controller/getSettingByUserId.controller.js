const httpStatus = require( 'http-status' );
const pick = require( '../../../utils/pick' )
const catchAsync = require ( '../../../utils/catchAsync' )
const {sendResponse} = require( '../../../utils/responseHandler' )
const settingservice = require( '../services/index' )

const getSettingById = catchAsync ( async ( req, res) => {

   const userId = req.user.id

   const result = await settingservice.getSettingbyId({userId})

   if(result.status){
     sendResponse( res, httpStatus.OK,result,null)
   }
   else{
     sendResponse ( res, httpStatus.BAD_REQUEST, null, result)
   }
 })

module.exports = getSettingById
