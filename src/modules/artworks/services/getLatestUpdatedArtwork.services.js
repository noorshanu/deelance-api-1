const mongoose = require("mongoose");
const artWorkModel = require("../model");
const { number } = require("joi");

const getLatestUpdatedArtwork = async (page, limit, filter,) => {
  try {
 
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = {
      active: true,
    };
    const sortQuery = { updatedAt: -1 };
  

    if (filter && filter.search != "") {
      
      filterQuery = {...filterQuery, categoryId: mongoose.Types.ObjectId(filter.search) };
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

module.exports = getLatestUpdatedArtwork;
