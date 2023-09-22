const mongoose = require('mongoose')
const USER = require('../user.model');


const getUserBySearch = async (search,) => {
  try {
    const searchRegex = new RegExp(search, 'i');

    let filterQuery = {
      $or: [
        { lastName: searchRegex },
        { firstName: searchRegex },
        { userName: searchRegex },
        { email: searchRegex }
      ]
    };


   const result = await USER.find(filterQuery).limit(10)

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

module.exports = getUserBySearch

