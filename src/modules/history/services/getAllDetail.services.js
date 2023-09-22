const ArtworkModel = require('../../artworks/model');
const TotalSellModel = require('../../analytics/sale.model')
const UserModel  = require('../../users/user.model')

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getAllDetail = async () => {
    try {
        
        const artworks = await ArtworkModel.countDocuments({ active: true });
        const totalSell = await TotalSellModel.countDocuments({active:true})
        const totalActiveUser = await UserModel.countDocuments({active:true,isEmailVerified:true,isBlock:false})
        const doucmentData = {
            artworks,
            totalActiveUser,
            totalSell,
            
        };

        return { data:doucmentData, status: true, code: 200 };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllDetail;

