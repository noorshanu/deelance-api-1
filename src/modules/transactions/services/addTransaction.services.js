const TransactionModelModel = require('../model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const addTransaction = async (collectionData) => {
    try {
        const addResult = await TransactionModelModel.create({ ...collectionData });
        if (addResult) {
            return { data: addResult, status: true, code: 200 };
        }
        else {
            return { data: "Cannot add transaction", status: false, code: 400 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = addTransaction
