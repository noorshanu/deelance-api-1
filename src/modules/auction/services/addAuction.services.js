const mongoose = require('mongoose');
const AUCTIONMODEL = require('../auction.model')


const addAuction = async (collectionData) => {
    try {
        const addResult = await AUCTIONMODEL.create({ ...collectionData, });
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Cannot add auction", status: false, code: 400 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addAuction
