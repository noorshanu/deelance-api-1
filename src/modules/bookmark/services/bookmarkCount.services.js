const bookmark = require('../bookmark.model')
const httpStatus = require('http-status')
const mongoose = require('mongoose')
const ApiError = require('../../../utils/ApiError')

const getBookmarkCount = async (userId) => {
    console.log(userId);
    try {
        const filterQuery = { userId: mongoose.Types.ObjectId(userId) }

        let bookmarkCount = await bookmark.countDocuments(filterQuery)
        if (bookmarkCount) {
            return { data: bookmarkCount, status: true, code: 200 };
        }
        else {
            return { data: 0, status: true, code: 200 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}

module.exports = getBookmarkCount