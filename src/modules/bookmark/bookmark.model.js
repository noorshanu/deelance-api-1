const mongoose = require('mongoose');
const counterIncrementor = require('../../utils/counterIncrementer');

const bookmarkSchema = mongoose.Schema(
    {
        contAddr: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
        nftNo: {
            type: mongoose.SchemaTypes.String,
            required: true,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
        },
        active: {
            type: Boolean,
            default: true
        },
    },
    {
        timestamps: true,
    }
);

const bookmark = mongoose.model('bookmark', bookmarkSchema);

module.exports = bookmark;
