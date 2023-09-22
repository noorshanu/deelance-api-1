const mongoose = require('mongoose');
const categoryModel = require('../category.model');
const { number } = require('joi');


const getAllCategory = async (page, limit, filter, sort) => {
   try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = {  active: true}
    let sortQuery = { _id: -1 }

    if (sort != null) {
        sortQuery = sort
    }
    if(filter && filter.search !=""){
        var searchRegex = new RegExp(`.*${filter.search}.*`, "i")
        filterQuery.$or = [
                {name: { $regex: searchRegex }},
            ]
       
    }
    const listResult = await categoryModel.find(filterQuery).sort(sortQuery).skip(skip).limit(length)
    const totalResults = await categoryModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalResults / length);
    if (listResult) {
        return { data: listResult, totalResults, totalPages, page:start, limit:length,status:true,code:200 };
    }
    else{
        return { data: "Category not found", status:false,code:400 };
    }
} catch (error) {
       return { data: error.message, status:false,code:500 };
   }
};

module.exports = getAllCategory
