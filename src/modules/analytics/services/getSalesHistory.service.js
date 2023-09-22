const ArtworkModel = require('../../artworks/model');
const SALMODEL = require('../sale.model')

const mongoose = require("mongoose")

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const getSalesHisory = async () => {
    try {
        const filterQuery = { active: true }

        const artworkCount = await ArtworkModel.countDocuments(filterQuery)
        const saleCount = await SALMODEL.countDocuments(filterQuery)


        
        const allData= {
            total:artworkCount,
            sold:saleCount,
            unSold:artworkCount-saleCount,
            pending:0,
            canceled:0,
        }
        if (allData) {
            return { data: allData, status: true, code: 200 };
        }
        else {
            return { data: "Not artwork found", status: false, code: 400 };
        }

    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getSalesHisory
