const mongoose = require('mongoose');
const message = require('../messages.model');

const getUserChats = async (currentUserId) => {
    // try {
    //     const userChats = await message.aggregate([
    //         {
    //             $match: {
    //                 $or: [
    //                     { userId: currentUserId },
    //                     { receiverId: currentUserId },
    //                 ],
    //             },
    //         },
    //         {
    //             $group: {
    //                 _id: {
    //                     $cond: {
    //                         if: { $eq: ['$userId', currentUserId] },
    //                         then: '$receiverId',
    //                         else: '$userId',
    //                     },
    //                 },
    //                 messages: { $push: '$$ROOT' },
    //             },
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 userId: '$_id',
    //                 messages: 1,
    //             },
    //         },
    //     ]);

    //     console.log(userChats);

    //     if (userChats) {
    //         return { data: userChats, status: true, code: 200 };
    //     } else {
    //         return { data: "No messages found", status: false, code: 404 };
    //     }
    // } catch (error) {
    //     return { data: error.message, status: false, code: 500 };
    // }
    try {
        const userChats = await message.find({
            $or: [{ userId: currentUserId }, { recieverId: currentUserId }],
        })
        console.log(userChats)
        if (userChats) {
            return { data: userChats, status: true, code: 200 };
        }
        else {
            return { data: "Cannot get message", status: false, code: 400 };
        }
    }
    catch (error) {
        return { data: error.message, status: false, code: 500 };
    }
}


// async function getChatMessages(currentUserId, selectedUserId) {
//   try {
//     const chatMessages = await ChatMessage.find({
//       $or: [
//         { sender: currentUserId, receiver: selectedUserId },
//         { sender: selectedUserId, receiver: currentUserId },
//       ],
//     }).sort({ timestamp: 1 });
//     return chatMessages;
//   } catch (error) {
//     throw error;
//   }
// }

module.exports = getUserChats

    //   getChatMessages,

