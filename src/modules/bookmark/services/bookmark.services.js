const bookmark = require('../bookmark.model');
const mongoose = require('mongoose');

/**
 * Create a Series
 * @param {Object} favouriteData
 * @returns {Promise<Favourite>}
 */
const addToBookMarkService = async (bookMarkData) => {
    try {
        let duplicatebookmark = await bookmark.findOne({ ...bookMarkData, active: true })
        if (duplicatebookmark) {
            await bookmark.findByIdAndDelete(duplicatebookmark._id)
            return { status: true, code: 200, msg: "remove" }
        }
        const bookMark = await bookmark.create({ ...bookMarkData });
        if (bookMark) {
            return { status: true, code: 201, msg: "added" };
        } else {
            return { status: false, code: 400,msg: "added" };
        }
    } catch (error) {
        return { status: false, code: 500, msg: error.message }
    }
};

module.exports = addToBookMarkService;