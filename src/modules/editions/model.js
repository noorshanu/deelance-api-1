const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const editionsSchema = mongoose.Schema({
    ownerId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    artworkId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    seqId: {
        type: Number
    },
    isListed: {
        type: mongoose.SchemaTypes.Boolean,
        default:false
    },
    source:{
        type: mongoose.SchemaTypes.String,
        enum:["created","imported"]
    },
    sold: {
        type: mongoose.SchemaTypes.Boolean,
        default:false
    },
    contractAddress: {
        type: mongoose.SchemaTypes.String,
        default:""
    },
    editionNo: {
        type: mongoose.SchemaTypes.Number,
    },
    paymentLockedBy:{
        type: mongoose.SchemaTypes.String,
    },
    propsObj:{
        type: Object,
    },
    editionJsonData:{

    },
    assetUrl: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    assetType: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    assetMeta: {
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


// add plugin that converts mongoose to json
editionsSchema.plugin(toJSON);

editionsSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('editions')
    next();
});

/**
 * @typedef Editions
 */

const Editions = mongoose.model('editions', editionsSchema);
module.exports = Editions;