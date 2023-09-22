       
       
const mongoose = require('mongoose');
const loginAcitivityModel = require('./../loginActivity.model');

/**
 * Create a Series
 * @param {Object} 
 * @returns {Promise<Series>}
 */
const deleteLoginActivityRecord = async ({userId,recordId}) => {
    
    const filterQuery = {userId:mongoose.Types.ObjectId(userId),_id: mongoose.Types.ObjectId(recordId)}
    try{  
        const findCategory = await loginAcitivityModel.findOne(filterQuery)
        
        if(!findCategory){
            return {data:"Not found.",status:false,code:400}
        }else{
            const addResult = await loginAcitivityModel.deleteOne({_id:mongoose.Types.ObjectId(recordId)});
            if(addResult){
                return {data:"deleted succefully",status:true,code:200}
            }else{
                return {data:"Unable to Delete ",status:false,code:400}
            }
        }
       
    }catch(error){
        return {data:error.message,status:false,code:500}
    }
    
   
};

module.exports = deleteLoginActivityRecord
