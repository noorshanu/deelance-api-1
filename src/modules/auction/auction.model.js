const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');

const auctionSchema = new mongoose.Schema({
  artworkId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  bidAmount: {
    type: Number,
    required: true
  },
  expiryDate: {
    type: Date,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  auctionType: {
    type: String,
    enum: ['bid', 'auction'],
    required: true
  },
  active:{
   type: Boolean,
   default:true
  }
},
{
  timestamps: true,
}
);

auctionSchema.plugin(toJSON)

const auction = mongoose.model('auction',auctionSchema);

module.exports = auction

