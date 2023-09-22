const TransactionModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getTopseller = async (fromDate,toDate,page, limit, filter, sort) => {

    try {

        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;

        let sortQuery = { _id: -1 }
    
        if (sort != null) {
            sortQuery = sort
        }
        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
              let value = sort[key];
              let numericValue = Number(value);
              if (!isNaN(numericValue)) {
                sort[key] = numericValue;
              }
            }
          }

        const filterQuery = {
            active: true
        }

        if (fromDate && toDate) {
            filterQuery['createdAt'] = {
                '$gte': new Date(new Date(fromDate).setHours(0, 0, 0, 0)),
                '$lte': new Date(new Date(toDate).setHours(23, 59, 59,999))
            }
        }

        //Todo:transaction for NFT

        let aggregateQuery = [
            {
                $match:filterQuery
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "sellerInfo"
                }
            },
            {
                $unwind: {
                    path: '$sellerInfo',
                    preserveNullAndEmptyArrays: true,
                },
            },

            {
                $group: {
                    _id: "$sellerId",
                    totalSales: { $sum: "$price" },
                    firstName: { $first: '$sellerInfo.firstName' },
                    lastName: { $first: '$sellerInfo.lastName' },
                    profilePic: { $first: '$sellerInfo.profilePic' }
                }
            },
            {
                $sort: { totalSales: -1 }
            },
            {
                $project: {
                    _id: 1,
                    totalSales: 1,
                    firstName: 1,
                    lastName: 1,
                    profilePic: 1
                }
            },

        ]

        
    const getTopseller = await TransactionModel.aggregate(aggregateQuery).sort(sortQuery).skip(skip).limit(length)
    const totalResults = await TransactionModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);

        if (getTopseller.length > 0) {
            return { data: getTopseller, totalResults, totalPages, page:start, limit:length,status: true, code: 200 };
        }
        else {
            return { data: "No Top Seller found", status: false, code: 400 };
        }

    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getTopseller
