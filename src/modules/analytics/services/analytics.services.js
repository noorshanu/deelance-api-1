const ArtworkModel = require('../../artworks/model');
 const auctionModel = require('../../auction/auction.model')

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getAnalytic = async () => {
    try {
        
        const artworks = await ArtworkModel.countDocuments({ active: true });
        const auctions = await auctionModel.countDocuments({active:true})
        const uniqueCreatorCount = await ArtworkModel.aggregate([
            { $match: { active: true, createdBy: { $ne: null } } },
            { $group: { _id: "$createdBy" } },
            { $group: { _id: null, count: { $sum: 1 } } }
        ]);

        const creatorCount = uniqueCreatorCount.length > 0 ? uniqueCreatorCount[0].count : 0;

        const doucmentData = {
            artworks,
            creators: creatorCount,
            auctions,
            canceled:24
        };

        return { data:doucmentData, status: true, code: 200 };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAnalytic;

