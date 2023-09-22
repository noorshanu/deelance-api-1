
const mongoose = require('mongoose');
const LoginDetailModel = require('./../loginActivity.model');

const getAllRecordServices = async (page, limit, filter, sort, userId) => {
    try {
       
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let sortQuery = { _id: -1 }

        if (sort != null) {
            sortQuery = sort
        }
        let filterQuery = { userId: mongoose.Types.ObjectId(userId) }

        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;
                }
            }
        }

        if (filter && filter.search != "") {
            var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
            filterQuery.$or = [
                { type: { $regex: searchRegex } },
            ]
        }

        const listResult = await LoginDetailModel.find(filterQuery).sort(sortQuery).skip(skip).limit(length);
        const totalResults = await LoginDetailModel.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);

        if (listResult.length >= 0) {
            return {
                data: listResult,
                totalResults,
                totalPages,
                page: start,
                limit: length,
                status: true,
                code: 200
            };
        } else {
            return { data: 0, status: true, code: 200 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllRecordServices