const mongoose = require("mongoose");
const SALEMODEL = require("../sale.model");
const { number } = require("joi");

const getAllNFTupdate = async (page, limit, sort, filter) => {
  try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = {
      active: true,
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

    const listResult = await SALEMODEL.aggregate([
      {
        $match: filterQuery,
      },
      {
        $lookup: {
          from: "users", 
          localField: "buyerId", 
          foreignField: "_id", 
          as: "BuyerDetails", 
        },
      },
      {
        $project: {
          _id: 1,
          active: 1,
          buyerId: 1,
          buyerWallet: 1,
          contractAddress: 1,
          editionNo: 1,
          priceETH: 1,
          priceUSD: 1,
          sellerWallet: 1,
          artworkName: 1,
          sellerId: 1,
          artworkId: 1,
          createdAt: 1,
          updatedAt: 1,
          seqId: 1,
          __v: 1,
          BuyerDetails: {
            _id: 1,
            firstName: 1,
            lastName: 1,
            userName: 1,
            bio: 1,
            isVerified: 1,
            profilePic: 1,
            coverPic: 1,
            isEmailVerified: 1,
            
          },
        },
      },
      {
        $sort: sortQuery,
      },
      {
        $skip: skip,
      },
      {
        $limit: length,
      },
    ]);

    const totalResults = listResult.length; 
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

module.exports = getAllNFTupdate;
