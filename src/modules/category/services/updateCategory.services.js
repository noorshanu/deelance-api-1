const mongoose = require('mongoose');
const CategoryModel = require('../category.model');

const updateCategory = async (seriesId, dataObj) => {
  try{
    
    if(dataObj.name){
      const findCategory = await CategoryModel.findOne({active:true,name:{'$regex': dataObj.name,$options:'i'}})
      if(findCategory){
        return {data:"Category name is already exist",status:false,code:400}
      }
      
    }

   
    
    
    const categoryearchQuery = { active: true, _id: mongoose.Types.ObjectId(seriesId) }
    const updateResult = await CategoryModel.findOneAndUpdate(categoryearchQuery, dataObj,{new: true});
  if(updateResult){
    return {data:updateResult,status:true,code:200}
  }else{
    return {data:"Category Not Found",status:false,code:400}
  }
  }catch(error){
    return {data:error.message,status:false,code:500}
  }
};

module.exports = updateCategory
