const ArtworkModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const updateArtwork = async (artworkid,collectionData) => {
    try {
        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(artworkid) }
        const updateArtwork = await ArtworkModel.findOneAndUpdate(filterQuery, { ...collectionData }, { new: true });
        if (updateArtwork) {
            return { data: updateArtwork, status: true, code: 200 };
        }
        else {
            return { data: "Cannot Update collection", status: false, code: 400 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = updateArtwork
