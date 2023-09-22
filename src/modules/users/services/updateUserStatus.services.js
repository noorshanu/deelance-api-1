const httpStatus = require('http-status');
const User = require("./../user.model")
const mongoose = require('mongoose');


const updateUserStatus = async (id, reqbody) => {
    try {
        let filterQuery = { _id: mongoose.Types.ObjectId(id), active: true }
        const updateResult = await User.findOneAndUpdate(filterQuery, { ...reqbody }, { new: true });

        if (updateResult) {
            return { data: updateResult, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {

        return { data: error.message, status: false, code: 500 };
    }
}

module.exports = updateUserStatus 