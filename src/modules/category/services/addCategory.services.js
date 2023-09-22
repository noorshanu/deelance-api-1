const mongoose = require('mongoose');
const categoryModel = require('../category.model');

/**
 * Create a Series
 * @param {Object} categoryData
 * @returns {Promise<Series>}
 */
const addCategory = async (categoryData) => {
    try{
        const findQuery = categoryData.name
        
        const findCategory = await categoryModel.findOne({name:  {'$regex': findQuery,$options:'i'} ,active:true})
       
        if(findCategory){
            return {data:"This Category name is already exist.",status:false,code:400}
        }else{
            const addResult = await categoryModel.create({ ...categoryData, });
            if(addResult){
                return {data:addResult,status:true,code:200}
            }else{
                return {data:"Unable to add Category",status:false,code:400}
            }
        }
       
    }catch{
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = addCategory
