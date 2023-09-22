const mongoose = require("mongoose");

const BOOKMARK = require('../bookmark.model')

const getBookmarkArtwork = async ({userId, page, limit}) => {
  try {

    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let sortQuery = { _id: -1 };


    const filterQuery = { userId:mongoose.Types.ObjectId(userId) };
     let ActiveBid= await BOOKMARK.aggregate([
      {
        $match: filterQuery,
      },
     ]).sort(sortQuery)
     const totalResults = await  BOOKMARK.countDocuments(filterQuery)
    const totalPages = Math.ceil(totalResults / length);
     const data = {
      data: ActiveBid,
      totalResults,
      totalPages,
      page: start,
      limit: length,
    };
    if (ActiveBid) {
      return { data, status: true, code: 200 };
    } else {
      return { data:"No Record Found", status: false, code: 404 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getBookmarkArtwork;
