const ArtworkModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addVisitorCount = async (artworkId) => {
    try {
        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(artworkId) }

        const artworkResult = await ArtworkModel.findOne(filterQuery, 'visitCount')

        if (artworkResult) {
            return { data: artworkResult, status: true, code: 200 };
        }
        else {
            return { data: "Not artwork found", status: false, code: 400 };
        }

    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addVisitorCount
