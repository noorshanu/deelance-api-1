const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const TransactionSchema = mongoose.Schema({
    
    artworkId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    creatorId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    sellerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    collectionId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true
    },
    price: {
        type: mongoose.SchemaTypes.Number,
        required: true
    },
    currency: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    seqId: {
        type: Number
    },
    buyWalletAddr: {
        type: mongoose.SchemaTypes.String,
    },
    walletType: {
        type: mongoose.SchemaTypes.String,
    },
    responseObj: {
      
    },
    metaData:{

    },
    paymentMode:{
        type: Number,
        enum:[0,1,2,3],
    },
    paymentStatus:{
        type: Number,
        enum:[0,1,2,3],
    },
    orderNo:{
        type: Number,
    },
    trnxFor:{
        type:String,
        default:"nft",
        enum:['nft']
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
TransactionSchema.plugin(toJSON);

TransactionSchema.pre('save', async function (next) {
    const doc = this;
    doc.seqId = await counterIncrementor('Transactions')
    next();
});

/**
 * @typedef Token
 */

const Counters = mongoose.model('Transactions', TransactionSchema);
module.exports = Counters;