const mongoose = require('mongoose');
const walletModel = require('../wallets.model');

/**
 * Create a Series
 * @param {Object} walletData
 * @returns {Promise<Series>}
 */
const addWallet = async (userId, walletData) => {
  try {
    const searchQuery = { active: true, userId: mongoose.Types.ObjectId(userId) };
    const data= {
        userId,
        ...walletData
    }
    const updateResult = await walletModel.findOneAndUpdate(
      searchQuery,
      { $set: data },
      { upsert: true, new: true }
    );

    if (updateResult) {
      return { data: updateResult, status: true, code: 200 };
    } else {
      return { data: "wallet not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = addWallet;
