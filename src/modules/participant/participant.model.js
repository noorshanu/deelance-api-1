const mongoose = require('mongoose');


const participantSchema = mongoose.Schema(
    {
        roomId: {
            type: String, 
            required: true,
        },
        userId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'User',
            required: true,
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

const participant= mongoose.model('participants', participantSchema);

module.exports = participant;
