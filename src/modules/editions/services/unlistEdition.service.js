const mongoose = require('mongoose');
const EDITIONMODEL = require('../model');


const unListEdition = async (editionId) => {
  try {
    let filterQuery = { active: true, _id: mongoose.Types.ObjectId(editionId) }
    
       
      const updated = await EDITIONMODEL.findOneAndUpdate(filterQuery, { $set: { isListed: false } },
        { new: false })
        console.log(updated);
      if (updated) {
        return { data: updated, message: "unlisted Successfully", status: true, code: 200 }
      } else {
        return { data: "Not Found", status: false, code: 400 }
      }
    
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};
module.exports = unListEdition