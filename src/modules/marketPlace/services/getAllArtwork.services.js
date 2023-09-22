const ARTWORK = require('../../artworks/model')
const ApiError = require('../../../utils/ApiError')
const httpStatus = require('http-status')
var mongoose = require('mongoose');

const getAllArtwork = async(page, limit,isSecondary, filter,userId ) =>{


  try{
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;
    const user = mongoose.Types.ObjectId(userId)
    let filterQuery = {active:true};
    let sortQuery = { _id: -1 };

   if(isSecondary){
    filterQuery ={...filterQuery,isSecondary:true}
   }
   if(filter.name){
      var searchRegex = new RegExp(`.*${filter.name}.*`, "i");
      filterQuery = { ...filterQuery, name: { $regex: searchRegex }} ;
   }
   if(filter.category){
    filterQuery = { ...filterQuery, categoryId:mongoose.Types.ObjectId(filter.category)}
 }


   console.log(userId);

  let result = await ARTWORK.aggregate([
    {
      $match: filterQuery,
    },
    {
      $lookup: {
        from: "users",
        localField: "ownerId",
        foreignField: "_id",
        as: "OwnerObj",
      },
    },
    {
      $unwind:"$OwnerObj"
    },
    {
      $lookup: {
        from: "users",
        localField: "createdBy",
        foreignField: "_id",
        as: "CreaterObj",
      },
    },
    {
      $unwind:"$CreaterObj"
    },
    {
      $lookup: {
        from: "bookmarks",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$artworkId", "$$id"] },
                ],
              },
            },
          },
          {
            $project: {
              userId: 1 
            }
          }
        ],
        as: "bookmarks",
      }
    }

  ]).sort(sortQuery).skip(skip).limit(length)
  let totalResults = await ARTWORK.countDocuments(filterQuery)
  let totalPages = Math.ceil(totalResults / length);

    const data =  {
      data:result,
      totalResults,
      totalPages,
      page:start,
      limit:length
    }

    if (result.length > 0) {
      return {data, status: true, code: 200 };
    } else {
      return { data: [], status: false, code: 400 };
    }
  }
  catch(error){
      return { data: error.message, status: false, code: 500 };

  }

}

module.exports = getAllArtwork;
