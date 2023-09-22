const User = require("../user.model");
const mongoose = require("mongoose");

const updateUserWallet = async (userId, body) => {
    try {
        
        const userObj = await User.findOne({ _id: mongoose.Types.ObjectId(userId) })
        const regex = new RegExp(`^${body.wallet}$`, 'i');
        if (userObj?.wallet && userObj.wallet.toLowerCase() != body.wallet.toLowerCase()) {
            return { data: `Connect with ${userObj.wallet}, to Buy or List Artwork.`, status: false, code: 403 };
        }else if(await User.findOne({wallet:regex})){
            return { data: "Another User is Already Connected to Same Wallet ,Please Switch account to Buy.", status: false, code: 400 };
        }else if (!userObj.wallet) {
            let filterQuery = { _id: mongoose.Types.ObjectId(userId), active: true };
            const updatedResult = await User.findOneAndUpdate(filterQuery, {wallet:body.wallet.toLowerCase()}, {
                new: true,
            });
            if (updatedResult) {
                return { data: updatedResult, status: true, code: 200 };
            } else {
                return { data: "User not found", status: false, code: 400 };
            }
        }
        else if (userObj.wallet == body.wallet.toLowerCase()) {
            return { data: "OK", status: true, code: 202 };
        }

    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = updateUserWallet;
