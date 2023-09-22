const Sales = require('../sale.model');

/**
 * Create a Series
 * @param {Object} collectionData
 * @returns {Promise<Series>}
 */
const topSeller = async (startDateParam, endDateParam, page, limit, filter, sort,) => {
    try {
        const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
        const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
        const skip = (start - 1) * length;
        let sortQuery = { _id: -1 }

        if (sort != null) {
            sortQuery = sort
        }
        let filterQuery = { active: true }
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
        const uniqueCreatorCount = await Sales.aggregate([
            { $match: { active: true, ...filterQuery } },
            {
                $lookup: {
                    from: "users",
                    localField: "sellerId",
                    foreignField: "_id",
                    as: "userObj"
                }
            },
            {
                $unwind: { path: "$userObj", preserveNullAndEmptyArrays: true },
            },
            {
                $group: {
                    _id: "$sellerId",
                    userObj: { $first: "$userObj" },
                    sellerCount: { $sum: 1 } // Count the number of students for each subject
                }
            },
            {
                $sort: { sellerCount: -1 } // Sort by studentCount in descending order
            },
            {
                $project: {
                    "userObj.firstName": 1,
                    "userObj.email": 1,
                    "userObj.lastName": 1,
                    "userObj.userName": 1,
                    "userObj.profilePic": 1,
                    "userObj._id": 1,
                    sellerCount: 1
                }
            },
            {
                $skip: skip, // Skip the specified number of documents
            },
            {
                $limit: length, // Limit the number of documents returned
            }
        ]);

        return {
            data: uniqueCreatorCount,
            status: true,
            startDate: startDateParam,
            endDate: endDateParam,
            code: 200
        };
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = topSeller;

