const mongoose = require('mongoose');

const notificationSchema = mongoose.Schema({
    receiverId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    type: {
        type: String,
        enum: ['normal', 'follow', 'bid', 'auction'],
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    active: {
        type: Boolean,
        default: true
    },
    timeRange: {
        type: String,
    }
},
    {
        timestamps: true,
    }
);

const notification = mongoose.model('notification', notificationSchema);

module.exports = notification;
