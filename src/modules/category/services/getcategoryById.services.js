const mongoose = require('mongoose');
const CategoryModel = require('../category.model');

const getCategoryById = async (id) => {
   try {  
    let filterQuery = {active: true, _id : mongoose.Types.ObjectId(id)}
    const series = await CategoryModel.findOne(filterQuery)
    if (series) {
        return { data: series, status:true,code:200 };
    }
    else{
        return { data: "Category Not Found", status:false,code:400 };
    }
    } catch (error) {
       return { data: error.message, status:false,code:500 };
   }
};

module.exports = getCategoryById
