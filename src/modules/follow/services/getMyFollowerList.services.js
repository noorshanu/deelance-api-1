       
       
const mongoose = require('mongoose');
const followModel = require('../follow.model');

/**
 * Create a Series
 * @param {Object} seriesData
 * @returns {Promise<Series>}
 */
const getMyFollowerList = async (userId) => {
    try{  
        
        const objectId = mongoose.Types.ObjectId(userId)
            const filterQuery = {userId:objectId}
            //const addResult = await followModel.find({ userId:objectId });
            let followerList = await followModel.aggregate([
                {
                    $match: filterQuery
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "followerId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user" // Flatten the "user" array
                },
                {
                    $project: {
                        "user.firstName": 1,
                        "user.lastName": 1,
                        "user.coverPic": 1,
                        "user.profilePic": 1,
                        "user.userName": 1,
                        "user._id": 1
                    }
                }
            ]);
            if(followerList){
                return {data:followerList,status:true,code:200}
            }else{
                return {data:0,status:true,code:200}
            }
        
       
    }catch(error){
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = getMyFollowerList
