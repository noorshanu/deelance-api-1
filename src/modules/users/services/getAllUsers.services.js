const httpStatus = require('http-status');
const User = require("./../user.model")
const mongoose = require('mongoose');


const getUsersList = async (page, limit, filter = {}, sort) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let filterQuery = { active: true }
        let sortQuery = { _id: -1 }

        for (let key in sort) {
            if (sort.hasOwnProperty(key)) {
                let value = sort[key];
                let numericValue = Number(value);
                if (!isNaN(numericValue)) {
                    sort[key] = numericValue;
                }
            }
        }

        if (sort != null) {
            sortQuery = sort
        }

        if (filter?.firstName) {
            let a = {
                $or: [
                    { firstName: { $regex: filter.firstName, $options: "i" } },
                    { wallet: { $regex: filter.firstName, $options: "i" } },
                    { email: { $regex: filter.firstName, $options: "i" } }
                ]
            }
            var searchRegex = new RegExp(`.*${filter.firstName}.*`, "i")
            filterQuery = { ...filterQuery, ...a }
        }

        const listResult = await User.find(filterQuery).sort(sortQuery).skip(skip).limit(length)
        const totalResults = await User.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / limit);
        if (listResult) {
            return { data: listResult, totalResults, totalPages, page: start, limit: length, status: true, code: 200 };
        }
        else {
            return { data: "User not found", status: false, code: 400 };
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };

    }
}


module.exports = getUsersList 
