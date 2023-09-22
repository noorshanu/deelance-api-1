const mongoose = require('mongoose');
const followModel = require('../follow.model');

/**
 * Get the list of users that the specified user is following
 * @param {string} userData - User's ObjectId
 * @returns {Promise<Object>}
 */
const getMyFollowingList = async (userData) => {
    try {
        const userId = mongoose.Types.ObjectId(userData);
        const filterQuery = { followerId: userId };

        let followingList = await followModel.aggregate([
            {
                $match: filterQuery
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user"
                }
            },
            {
                $unwind: "$user" // Flatten the "user" array
            },
            {
                $project: {
                    "user.firstName": 1,
                    "user.lastName": 1,
                    "user.coverPic": 1,
                    "user.profilePic": 1,
                    "user.userName": 1,
                    "user._id": 1
                }
            }
        ]);

        if (followingList.length > 0) {
            return { data: followingList, status: true, code: 200 };
        } else {
            return { data: [], status: true, code: 200 }; // Return an empty array if there are no results.
        }
    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
};

module.exports = getMyFollowingList;
