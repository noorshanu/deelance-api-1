       
       
const mongoose = require('mongoose');
const followModel = require('../follow.model');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const deleteFollower = async (seriesData) => {
    try{  
        const findCategory = await followModel.findOne({userId:seriesData.userId,followerId:seriesData.followerId})

        if(!findCategory){
            return {data:"Not found.",status:false,code:400}
        }else{
            const addResult = await followModel.deleteOne({userId:seriesData.userId,followerId:seriesData.followerId});
            if(addResult){
                return {data:"deleted succefully",status:true,code:200}
            }else{
                return {data:"Unable to Delete ",status:false,code:400}
            }
        }
       
    }catch{
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = deleteFollower
