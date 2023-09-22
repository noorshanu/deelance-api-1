const SETTING = require('../settting.model')
const mongoose = require('mongoose')


const addNotificationSetting = async(userId)=>{
  try{
  const addNewSetting = await SETTING.create({userId:mongoose.Types.ObjectId(userId)})
  if(addNewSetting){
    return{
      data:addNewSetting , status: true, code:201
    }
  }
  else{
    return{
      data:"Something Went Wrong" , Status:false, code:400
    }
  }
}
catch(error){
  return{data:error.message, Status:false , code: 500  }
}
}
module.exports = addNotificationSetting

