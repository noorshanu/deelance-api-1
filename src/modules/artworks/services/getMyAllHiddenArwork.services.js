const mongoose = require("mongoose");
const artWorkModel = require("../model");
const { number } = require("joi");

const getMyAllHiddenArwork = async (page, limit, filter, sort, userId) => {
  try {
 
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = {
      active: true,
      createdBy: mongoose.Types.ObjectId(userId),
      isUnlockable:false,
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
    
    const listResult = await artWorkModel
      .find(filterQuery)
      .sort(sortQuery)
      .skip(skip)
      .limit(length);
    const totalResults = await artWorkModel.countDocuments(filterQuery);
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

module.exports = getMyAllHiddenArwork;
