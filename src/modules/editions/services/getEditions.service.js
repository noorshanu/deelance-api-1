const mongoose = require("mongoose");

const { number } = require("joi");
const Editions = require("../model");

const getEditions = async (page, limit, filter, sort, userId) => {
  try {
 
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 4;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = {
      active: true,
      createdBy: mongoose.Types.ObjectId(userId),
    };
    const sortQuery = { _id: 1 };
    for (let key in sort) {
      if (sort.hasOwnProperty(key)) {
        let value = sort[key];
        let numericValue = Number(value);
        if (!isNaN(numericValue)) {
          sort[key] = numericValue;
        }
      }
    }


  
    if (sort != null) {
      sortQuery = sort;
    }

    if (filter && filter.search != "") {
      var searchRegex = new RegExp(`.*${filter.search}.*`, "i");
      filterQuery.$or = [{ name: { $regex: searchRegex } }];
    }
    
    const listResult = await Editions
    .aggregate([
      {
        $match: filterQuery
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user"
        }
      },
      
        {
          $unwind:"$user"
        },
        {
          $project:{
            "user.password":0,
            "user._id": 0,
            "user.bio": 0,
            "user.isVerified": 0,
             "user.coverPic": 0,
            "user.isEmailVerified": 0,
            "user.active":0,
            "user.email": 0,
            "user.role": 0,
            "user.createdAt":0,
            "user.updatedAt": 0,
            "user.__v": 0,
            "user.externalLink": 0,
            "user.wallet": 0
          }
        }
      
    ])
      // .find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(length);
    const totalResults = await Editions.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);
    return {
      data: {
        data: listResult,
        totalResults,
        totalPages,
        page: start,
        limit: length,
      },
      status: true,
      code: 200,
    };
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getEditions;
