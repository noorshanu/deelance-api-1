const ArtworkModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getArtworkByCollectionId = async (collectionId, page, limit, filter = {}, sort) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let sortQuery = { _id: -1 };
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

        const filterQuery = { active: true, collectionId: mongoose.Types.ObjectId(collectionId) }


        let aggregateQuery = [
            { $match: filterQuery },
            {
                $lookup: {
                    from: "collections",
                    localField: "collectionId",
                    foreignField: "_id",
                    as: "collectionData"
                }
            },
            {
                $unwind: { path: "$collections", preserveNullAndEmptyArrays: true },
            }
        ]

        const artworkResult = await ArtworkModel.aggregate(aggregateQuery).sort(sortQuery)
            .skip(skip)
            .limit(length);
        
        const totalResults = await ArtworkModel.countDocuments(
            filterQuery
        );
		const totalPages = Math.ceil(totalResults / length);

        if (artworkResult) {
            return {
                data: artworkResult,
                totalResults,
                totalPages,
                page: start,
                limit: length, status: true, code: 200
            };
        }
        else {
            return { data: "Cannot get Artwork by collection id", status: false, code: 400 };
        }

    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getArtworkByCollectionId
