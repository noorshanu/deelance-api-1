const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const walletSchema = mongoose.Schema({
  
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        require:true
    },
    metamaskWallet: {
        type: mongoose.SchemaTypes.String,
        default:""
    },
    coinbaseWallet: {
        type: mongoose.SchemaTypes.String,
        default:""
    },
    butskiWallet: {
        type: mongoose.SchemaTypes.String,
       default:""
    },
    connectWallet: {
        type: mongoose.SchemaTypes.String,
       default:""
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

walletSchema.plugin(toJSON);
walletSchema.plugin(paginate);


const Category = mongoose.model('wallets', walletSchema);
module.exports = Category;