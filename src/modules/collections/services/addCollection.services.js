const mongoose = require('mongoose');
const CollectionModel = require('../model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addCollection = async (collectionData) => {
    try {
        const addResult = await CollectionModel.create({ ...collectionData });

        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Cannot add collection", status: false, code: 400 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addCollection
