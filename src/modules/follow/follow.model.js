const mongoose = require('mongoose');

const followersSchema = mongoose.Schema({
  
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    
    },
    followerId: {
        type: mongoose.SchemaTypes.ObjectId,
        required:true
       
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

const Follows = mongoose.model('follows', followersSchema);
module.exports = Follows;