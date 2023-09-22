
const mongoose = require("mongoose");
const CHATROOMMODEL = require("../chatRoom.model");
const getUserSidebarChats = async ({ userId }) => {
    try {
        let aggQry = [
            {
                $match: {
                    participants: { $elemMatch: { userId: mongoose.Types.ObjectId(userId) } }
                }
            },
            {
                $lookup: {
                    from: 'messages',
                    let: { roomId: '$roomId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $eq: ['$roomId', '$$roomId'] }
                            }
                        },
                        {
                            $sort: { timestamp: -1 }
                        },
                        {
                            $limit: 1
                        }
                    ],
                    as: 'last_message'
                }
            },
            {
                $unwind: {
                    path: '$last_message',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participants.userId',
                    foreignField: '_id',
                    as: 'participantDetails'
                }
            },
            {
                $unwind: '$participantDetails'
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    last_message: {
                        _id: 1,
                        content: 1,
                        timestamp: 1,
                        sender_id: '$last_message.senderId',
                        // sender_username: {
                        //     $cond: [
                        //         { $eq: ['$last_message.senderId', mongoose.Types.ObjectId(userId)] },
                        //         'You',
                        //         '$participantDetails.username'
                        //     ]
                        // }
                    }
                }
            },
            {
                $match: {
                    'participantDetails.userId': '$participantDetails._id'
                }
            },
            // {
            //   $sort: { 'last_message.timestamp': -1 }
            // }
        ]

        const result = await CHATROOMMODEL.aggregate(aggQry)
        return { data: result, status: true, code: 200 };

    } catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}
module.exports = getUserSidebarChats
