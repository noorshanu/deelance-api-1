const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
let priceType ={
    0:'fixed',
    1:'bid',
    2:'auction'
}
const ArtworkSchema = mongoose.Schema({
    name: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    token: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    priceType: {
        type: Number,
        enum:[0,1,2],
        required: true
    },
    exterLink: {
        type: mongoose.SchemaTypes.String,
    },
    desc: {
        type: mongoose.SchemaTypes.String,
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    serviceFee: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    royalty: {
        type:Number,
        required: true
    },
    properties: {
        type: mongoose.SchemaTypes.String,
        
    },
    createdBy: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    seqId: {
        type: Number
    },
    isUnlockable: {
        type: Boolean,
        default: false
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
    auctionExpiryTime: {
        type: mongoose.SchemaTypes.String,
    },
    ownerId: {
        type: mongoose.SchemaTypes.ObjectId,
        default: null
    },
    contractAddress: {
        type: mongoose.SchemaTypes.String,
        default:""
    },
    launchDate: {
        type: mongoose.SchemaTypes.Date,
    },
    visitCount:{
        type: mongoose.SchemaTypes.Number,
    },
    propsObj:{
        type: Object,
    },
    progressStatus:{
        type: mongoose.SchemaTypes.Number,
        default:0,
    },
    totalSupply:{
        type: mongoose.SchemaTypes.Number,
        default:1,
    },
    active: {
        type: Boolean,
        default: true
    },
    contractMeta:{
    }
},
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
ArtworkSchema.plugin(toJSON);

ArtworkSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Artwork')
    next();
});

/**
 * @typedef Token
 */

const Artwork = mongoose.model('Artwork', ArtworkSchema);
module.exports = Artwork;