const mongoose = require('mongoose');
const ArtworkModel = require('../model');
const { number } = require('joi');

const getMyArtWorkServices = async (page, limit, filter, sort, userId) => {

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
                    from: "editions",
                    localField: "_id",
                    foreignField: "artworkId",
                    as: "editions"
                }
            },
            {
                $addFields: {
                    editionCount: { $size: "$editions" }
                }
            },
            {
                $project: {
                    name: 1,
                    assetUrl: 1,
                    assetType: 1,
                    editionCount: 1,
                    assetMeta: 1,
                    contractAddress: 1,
                    contractMeta:1
                }
            }
        ];

        if (sort != null) {
            sortQuery = sort;
        }

        const collections = await ArtworkModel.aggregate(aggregateQuery).exec();
        const totalResults = await ArtworkModel.countDocuments(filterQuery);
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

module.exports = getMyArtWorkServices;
