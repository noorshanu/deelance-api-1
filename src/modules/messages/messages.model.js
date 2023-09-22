const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const { string } = require('joi');

const messagesSchema = mongoose.Schema({

    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    roomId: {
        type: String,

    },
    recieverId: {
        type: mongoose.SchemaTypes.ObjectId,
        type: String,
    },
    message: {
        type: String,
        default: true
    },
    messageType: {
        type: String,
        enum: ['text', 'image'],
        default: true
    },
    assetUrl: {
        type: String,
        default: true
    },
    assetMeta: {

    },
},
    {
        timestamps: true,
    }
);

messagesSchema.plugin(toJSON);
messagesSchema.plugin(paginate);

const message = mongoose.model('message', messagesSchema);
module.exports = message;
