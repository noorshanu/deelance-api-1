const mongoose = require('mongoose');
const { toJSON } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');
const VisitorSchema = mongoose.Schema({
    ipAddr: {
        type: mongoose.SchemaTypes.String,
        required: true
    },
    visitCount:{
        type:Number
    }
},
    {
        timestamps: true,
    }
);


// add plugin that converts mongoose to json
VisitorSchema.plugin(toJSON);
/**
 * @typedef visitors
 */

const visitorsModel = mongoose.model('visitors', VisitorSchema);
module.exports = visitorsModel;