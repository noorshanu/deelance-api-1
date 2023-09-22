const PARTICIPANT = require("../../participant/participant.model");
const mongoose = require('mongoose')
const MESSAGES = require('../messages.model');
const { string } = require("joi");
const getArtworkById = async (roomId) => {
  try {


    let filterQuery = { roomId };
    let sortQuery = { _id: -1 };

  

    let messages = await MESSAGES.aggregate([
      {
        $match: filterQuery
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $project: {
          "userId": 1,
          "roomId": 1,
          "message": 1,
          "messageType": 1,
          "assetUrl": 1,
          "assetMeta": 1,
          "user._id": 1,
          "user.firstName": 1,
          "user.lastName": 1,
          "user.coverPic": 1
        }
      }
    ]).sort(sortQuery);



    if (messages) {
      return { messages, status: true, code: 200 };
    } else {
      return { data: "Something went wrong", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getArtworkById
