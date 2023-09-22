const TransactionModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getTopBuyer = async (fromDate,toDate,page,limit,filter,sort) => {

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

        const filterQuery = { active: true}

        //Todo:transaction for NFT
        if (fromDate && toDate) {
            filterQuery['createdAt'] = {
                '$gte': new Date(new Date(fromDate).setHours(0, 0, 0, 0)),
                '$lte': new Date(new Date(toDate).setHours(23, 59, 59,999))
            }
        }

        let aggregateQuery = [
            {
                $match:filterQuery
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
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
                    _id: "$userId",
                    totalSales: { $sum: "$price" },
                    firstName:{$first: '$sellerInfo.firstName'},
                    lastName:{$first: '$sellerInfo.lastName'},
                    profilePic:{$first:'$sellerInfo.profilePic'}
                }
            },
            {
                $sort: { totalSales: -1 }
            },
            {
                $project: {
                    _id: 1,
                    totalSales: 1,
                    firstName:1,
                    lastName:1,
                    profilePic:1
                }
            },

        ]

        const getTopBuyer = await TransactionModel.aggregate(aggregateQuery).sort(sortQuery).skip(skip).limit(length)
        const totalResults = await TransactionModel.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);
    
        if (getTopBuyer.length > 0) {
            return { data: getTopBuyer, totalResults, totalPages, page:start, limit:length,status: true, code: 200 };
        }
        else {
            return { data: "No Top Buyer found", status: false, code: 400 };
        }

    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getTopBuyer
