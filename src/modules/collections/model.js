const mongoose = require('mongoose');

const CollectionSchema = mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    intro: {
        type: mongoose.SchemaTypes.String,
    },
    token: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    logo: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    launchDate: {
        type: mongoose.SchemaTypes.Date,
    },
    categoryId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },

    isApproved: {
        type: Boolean,
        default: false
    },
    progressStatus: {
        type: Number,
        default: 0
    },
    contractAddress: {
        type: String,
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
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

const Counters = mongoose.model('Collection', CollectionSchema);
module.exports = Counters;