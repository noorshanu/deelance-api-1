const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
let priceType ={
    0:'fixed',
    1:'bid',
    2:'auction'
}
const SalesSchema = mongoose.Schema({
    buyerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    sellerId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    artworkId: {
        type: mongoose.SchemaTypes.ObjectId,
    },
    artworkName:{
        type: mongoose.SchemaTypes.String
    },
    contractAddress: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    editionNo: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    sellerWallet:{
        type: mongoose.SchemaTypes.String,
        required: true
    },
    buyerWallet:{
        type: mongoose.SchemaTypes.String,
    },
    priceETH: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    priceUSD: {
        type: mongoose.SchemaTypes.Number,
    },
    serviceFee: {
        type:Number,
    },
    royalty: {
        type:Number,
    },
    seqId:{
        type:Number,
    },
    metaData:{

    },
    active:{
        type: mongoose.SchemaTypes.Boolean,
        default:true
    }
},
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
SalesSchema.plugin(toJSON);

SalesSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Sales')
    next();
});

/**
 * @typedef Sales
 */

const Sales = mongoose.model('Sales', SalesSchema);
module.exports = Sales;