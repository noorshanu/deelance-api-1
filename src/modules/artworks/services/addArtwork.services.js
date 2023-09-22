const ArtworkModel = require('../model');
const deployNft = require('./deployNft.services');

const addArtwork = async (artworkData) => {
    try {
        const artworkItem = await ArtworkModel.findOne(
            { name: artworkData.name });
            if (artworkItem) {
                return { data: "Artwork With Name already exist", status: false, code: 400 }; 
            }

        const addResult = await ArtworkModel.create({ ...artworkData });
        await deployNft({artworkId:addResult.id,userId:artworkData.createdBy})
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        } else {
            return { data: "Cannot add artwork", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addArtwork;