const mongoose = require('mongoose');
const { toJSON, paginate } = require('../../models/plugins');
const counterIncrementor = require('../../utils/counterIncrementer');

const settingSchema = mongoose.Schema(
  {
   userId:{
    type:mongoose.Schema.Types.ObjectId,
    require:true
   },
   isProductUpload:{
    type:Boolean,
    default: false
   },
   isProductSell:{
    type:Boolean,
    default: false
   },
   isNewFollower:{
    type:Boolean,
    default:false
   },
   isLevelUp:{
    type:Boolean,
    default:false
   },
   active:{
    type:Boolean,
    default:true
   }
},
{
  timestamps: true,
}
)

settingSchema.plugin(toJSON);

const settings = mongoose.model("setting", settingSchema )

module.exports = settings
