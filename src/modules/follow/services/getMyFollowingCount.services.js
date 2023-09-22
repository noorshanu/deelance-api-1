       
       
const mongoose = require('mongoose');
const followModel = require('../follow.model');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const addCategory = async (seriesData) => {
    try{  
        const objectId = mongoose.Types.ObjectId(seriesData)
        
            const addResult = await followModel.countDocuments({ followerId:objectId });
            if(addResult){
                return {data:addResult,status:true,code:200}
            }else{
                return {data:0,status:true,code:200}
            }
        
       
    }catch{
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = addCategory
