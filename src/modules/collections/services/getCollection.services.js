const mongoose = require('mongoose');
const collection = require('../model');
const artWork = require('../../artworks/model');
const { number } = require('joi');

const getCollectionService = async (page, limit, filter, sort, userId) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;

        const filterQuery = {
            active: true,
            createdBy: mongoose.Types.ObjectId(userId)
        };

        if (filter && filter.search != "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
            filterQuery.$or = [
                { name: { $regex: searchRegex } },
            ]
        }
        const aggregateQuery = [
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: "artworks",
                    localField: "_id",
                    foreignField: "collectionId",
                    as: "artworks"
                }
            },
            {
                $addFields: {
                    editionCount: { $size: "$artworks" }
                }
            },
            {
                $project: {
                    artworks: 0
                }
            }
        ];

        if (sort != null) {
            sortQuery = sort;
        }

        const collections = await collection.aggregate(aggregateQuery).exec();
        const totalResults = await collection.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);
        return {
            data: collections,
            totalPages,
            totalResults,
            page: start,
            limit: length,
            status: true,
            code: 200
        };
    } catch (error) {
        return {
            data: error.message,
            status: false,
            code: 500
        };
    }
};

module.exports = getCollectionService;
