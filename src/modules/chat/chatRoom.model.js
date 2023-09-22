const mongoose = require('mongoose');


const chatRoomSchema = mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
        },
        participants: [
           
        ],
        latestMessage: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "messages",
        },
        conversationType: {
            type: String,
            default: 'peer'
        },
        createdBy: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'Users',
            required: true,
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
    }
);

const chatroom = mongoose.model('chatrooms', chatRoomSchema);

module.exports = chatroom;