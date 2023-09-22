const mongoose = require('mongoose');
const transactionModel = require('../../transactions/model');

/**
 * Create a Series
 * @param {Object} walletData
 * @returns {Promise<Series>}
 */
const addWallet = async (userId) => {
  try {
    const searchQuery = {creatorId: mongoose.Types.ObjectId(userId) };

   
    const countResult = await transactionModel.countDocuments(searchQuery);

    if (countResult) {
      return { data: countResult, status: true, code: 200 };
    } else {
      return { data: "wallet not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = addWallet;
