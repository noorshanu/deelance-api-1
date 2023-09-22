const ArtworkModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getArtworkById = async (artworkId) => {
    try {
        const filterQuery = { active: true, _id: artworkId}

        const artworkResult = await ArtworkModel.findById(filterQuery)

        if (artworkResult) {
            return { data: artworkResult, status: true, code: 200 };
        }
        else {
            return { data: "Cannot get Artwork by id", status: false, code: 400 };
        }

    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getArtworkById
