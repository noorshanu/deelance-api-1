// const mongoose = require('mongoose');
// const NotificationModel = require('../notification.model');
// const { number } = require('joi');

// /**
//  * Create a Series
//  * @param {Object} seriesData
//  * @returns {Promise<Series>}
//  */

// const getAllNotificationService = async (startDateParam, endDateParam, page, limit, filter, sort, userId) => {
//     try {

//         const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
//         const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
//         const skip = (start - 1) * length;

//         let sortQuery = { _id: -1 }
//         // let parseFilter = { startDate, endDate }

//         if (sort != null) {
//             sortQuery = sort
//         }


//         let filterQuery = { active: true, receiverId: mongoose.Types.ObjectId(userId) }


//         if (startDateParam && endDateParam) {
//             let startDate = new Date(startDateParam);
//             let endDate = new Date(endDateParam);

//             if (startDate.toDateString() === endDate.toDateString()) {
//                 endDate.setHours(23);
//                 endDate.setMinutes(59);
//                 endDate.setSeconds(59);
//             } else {
//                 endDate.setHours(0);
//                 endDate.setMinutes(0);
//                 endDate.setSeconds(0);
//             }
//             filterQuery = {
//                 ...filterQuery,
//                 createdAt: { $gte: startDate, $lt: endDate }
//             };
//         }
//         for (let key in sort) {
//             if (sort.hasOwnProperty(key)) {
//                 let value = sort[key];
//                 let numericValue = Number(value);
//                 if (!isNaN(numericValue)) {
//                     sort[key] = numericValue;
//                 }
//             }
//         }
//         if (sort != null) {
//             sortQuery = sort;
//         }


//         if (filter && filter.search != "") {
//             var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
//             filterQuery.$or = [
//                 { type: { $regex: searchRegex } },
//             ]

//         }
//         const listResult = await NotificationModel.find(filterQuery).sort(sortQuery).skip(skip).limit(length)
//         const totalResults = await NotificationModel.countDocuments(filterQuery);
//         const totalPages = Math.ceil(totalResults / length);

//         if (listResult.length > 0) {
//             return {
//                 data: listResult,
//                 totalResults,
//                 totalPages,
//                 page: start,
//                 limit: length,
//                 startDate,
//                 endDate,
//                 status: true,
//                 code: 200
//             };
//         }
//         else {
//             return { data: "notification not found", status: false, code: 400 };
//         }
//     } catch (error) {
//         return { data: error.message, status: false, code: 500 };
//     }
// };

// module.exports = getAllNotificationService


const mongoose = require('mongoose');
const NotificationModel = require('../notification.model');

const getAllNotificationService = async (startDateParam, endDateParam, page, limit, filter, sort, userId) => {
    try {
        console.log("startDate from service", startDateParam, endDateParam);

        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let sortQuery = { _id: -1 }

        if (sort != null) {
            sortQuery = sort
        }
        let filterQuery = { active: true, receiverId: mongoose.Types.ObjectId(userId) }

        if (startDateParam && endDateParam) {
            const startDate = new Date(startDateParam);
            let endDate = new Date(endDateParam);

            if (startDate.toDateString() === endDate.toDateString()) {
                endDate.setHours(23);
                endDate.setMinutes(59);
                endDate.setSeconds(59);
            } else {
                endDate.setHours(0);
                endDate.setMinutes(0);
                endDate.setSeconds(0);
            }

            filterQuery = {
                ...filterQuery,
                createdAt: { $gte: startDate, $lt: endDate }
            };
        } else if (!startDateParam && !endDateParam) {
            // Fetch all notifications, so no date range filter is applied
            // You might want to adjust other filters accordingly
        }

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

        const listResult = await NotificationModel.find(filterQuery).sort(sortQuery).skip(skip).limit(length);
        const totalResults = await NotificationModel.countDocuments(filterQuery);
        const totalPages = Math.ceil(totalResults / length);

        if (listResult.length >= 0) {
            return {
                data: listResult,
                totalResults,
                totalPages,
                page: start,
                limit: length,
                startDate: startDateParam,
                endDate: endDateParam,
                status: true,
                code: 200
            };
        } else {
            return { data: 0, status: true, code: 200 };
        }
    } catch (error) {
        console.error("Error in getAllNotificationService:", error);
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getAllNotificationService;

