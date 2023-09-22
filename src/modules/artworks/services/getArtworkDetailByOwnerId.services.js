const mongoose = require('mongoose')
const ARTWORK = require('../model')
const COLLECTION = require('../../collections/model')

const getArtworkDetailByOwnerId = async ({userId, page, limit}) => {
  try {

    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    const filterQuery = { active: true, ownerId: mongoose.Types.ObjectId(userId) };
    let sortQuery = { _id: -1 };




    let artworkDetailsById = await ARTWORK.aggregate([
      {
        $match: filterQuery,
      },

      {
        $lookup: {
          from: "users",
          localField: "ownerId",
          foreignField: "_id",
          as: "ownerDetails",
        },
      },

      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },

      {
        $lookup: {
          from: "collections",
          localField: "collectionId",
          foreignField: "_id",
          as: "collectionDetails",
        },
      },


    ]).sort(sortQuery).skip(skip).limit(length)
    const totalResults = await  ARTWORK.countDocuments(filterQuery)
    const totalPages = Math.ceil(totalResults / length);


    const data = {
     data: artworkDetailsById,
     totalResults,
     totalPages,
     page: start,
     limit: length,
   };

    if (artworkDetailsById) {
      return {data, status: true, code: 200 };
    } else {
      return { data: [], status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getArtworkDetailByOwnerId;
