const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');

const categorySchema = mongoose.Schema({
  
    name: {
        type: mongoose.SchemaTypes.String,
        
        required: true,
    
    },
    tag: {
        type: mongoose.SchemaTypes.String,
       
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

categorySchema.plugin(toJSON);
categorySchema.plugin(paginate);

const Category = mongoose.model('categories', categorySchema);
module.exports = Category;