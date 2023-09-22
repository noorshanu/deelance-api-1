       
       
const mongoose = require('mongoose');
const followModel = require('../follow.model');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const addCategory = async (seriesData) => {
    try{
        const findQuery = seriesData.name
        
        const findCategory = await followModel.findOne(seriesData)
       
        if(findCategory){
            return {data:"You are already following this user.",status:false,code:400}
        }else{
            const addResult = await followModel.create({ ...seriesData, });
            if(addResult){
                return {data:addResult,status:true,code:200}
            }else{
                return {data:"Unable to follow ",status:false,code:400}
            }
        }
       
    }catch{
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = addCategory
