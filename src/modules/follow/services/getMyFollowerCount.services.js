       
       
const mongoose = require('mongoose');
const followModel = require('../follow.model');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getallMyFollowerCount = async (userId) => {
    try{  
        
        const objectId = mongoose.Types.ObjectId(userId)
    
            const addResult = await followModel.countDocuments({ userId:objectId });
            if(addResult){
                return {data:addResult,status:true,code:200}
            }else{
                return {data:0,status:true,code:200}
            }
        
       
    }catch(error){
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = getallMyFollowerCount
