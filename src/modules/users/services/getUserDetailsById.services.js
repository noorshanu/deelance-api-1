const mongoose = require('mongoose')
const USER = require('../user.model');


const getUserDetailsById = async (userId) => {
  try {
  
    console.log('he')
    let filterQuery = {active:true,_id:userId};
   
   const result = await USER.findById(userId)

    if (result) {
      return {data:result, status: true, code: 200 };
    } else {
      return { data: "Something went wrong", status: false, code: 400 };
    }
  }
  catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getUserDetailsById

