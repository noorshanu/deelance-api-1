const httpStatus = require( 'http-status' );
const pick = require( '../../../utils/pick' )
const catchAsync = require ( '../../../utils/catchAsync' )
const {sendResponse} = require( '../../../utils/responseHandler' )
const settingservice = require( '../services/index' )

const updateSettings = catchAsync ( async ( req, res) => {
  console.log("req", req.body);
  console.log("user", req?.user?.id);
   const userId = req.user.id;
   let key = req.body.key;
   let value = req.body.value;
   console.log(key, value);

   const settingUpdate = await settingservice.updateSettings({userId, key, value})

   if(settingUpdate.status){
     sendResponse( res, httpStatus.OK,settingUpdate,null)
   }
   else{
     sendResponse ( res, httpStatus.BAD_REQUEST, null, settingUpdate )
   }
 })

module.exports = updateSettings
