const { getReceipts } = require('../../../_blockchain/utilities');
const Editions = require('../../editions/model');
const ArtworkModel = require('../model');
const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const updateDepArtwork = async (artworkid, collectionData) => {
    try {

        /* TODO : findOne and check if contract address is already present */
        /* if only hash get contract address */
        let contAddr = collectionData.contractAddress;
        console.log("contractAddress",collectionData.contractAddress);
        if (!collectionData.contractAddress) {
            contAddr = await getReceipts(collectionData.hash)
        }
        console.log("contAddr",contAddr);
       
        const filterQuery = { active: true, _id: mongoose.Types.ObjectId(artworkid) }
        const updateArtwork = await ArtworkModel.findOneAndUpdate(filterQuery, {contractAddress:contAddr,"contractMeta.hash":collectionData.hash}, { new: true });
        if (!contAddr) {
            let msg = collectionData?.hash ? "Deploying Contract on Blockchain":"Error While Uploading Contract, Try Again";
            return { data: msg, status: true, code: 201 }
        }
        /* update Many editions with contract address */
        await Editions.updateMany({artworkId: mongoose.Types.ObjectId(artworkid)},{contractAddress:collectionData.contractAddress})
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

module.exports = updateDepArtwork
