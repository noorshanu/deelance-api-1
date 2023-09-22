const AUCTION = require("../auction.model");
const { filter } = require("compression");
const mongoose = require('mongoose')

const getArtworkById = async ({id,page, limit, sort, startDate, endDate}) => {
  try {
    const length = limit && parseInt(limit, 10) > 0 ? parseInt(limit, 10) : 10;
    const start = page && parseInt(page, 10) > 0 ? parseInt(page, 10) : 1;
    const skip = (start - 1) * length;

    let filterQuery = { active: true, artworkId:mongoose.Types.ObjectId(id)};
    let sortQuery = { _id: -1 };



    let parseFilter = { startDate, endDate };

    if (parseFilter.startDate && parseFilter.endDate) {
      const startDate = new Date(parseFilter.startDate);
      let endDate = new Date(parseFilter.endDate);
      endDate.setHours(23);
      endDate.setMinutes(59);
      endDate.setSeconds(59);
      parseFilter = {
        ...parseFilter,
        createdAt: { $gte: startDate, $lt: endDate },
      };
      delete parseFilter.startDate;
      delete parseFilter.endDate;
      filterQuery = { ...filterQuery, ...parseFilter };
    }

    for (let key in sort) {
      if (sort.hasOwnProperty(key)) {
        let value = sort[key];
        let numericValue = Number(value);
        if (!isNaN(numericValue)) {
          sort[key] = numericValue;
        }
      }
    }
    if (sort != null) {
      sortQuery = sort;
    }

    const artworkById = await AUCTION.find(filterQuery).sort(sortQuery).skip(skip).limit(length)
    const totalResults = await  AUCTION.countDocuments(filterQuery)
    const totalPages = Math.ceil(totalResults / length);

    const data = {
       artworkById,
      totalResults,
      totalPages,
      page: start,
      limit: length,
    };
    if (artworkById) {
      return {data, status: true, code: 200 };
    } else {
      return { data: "Something went wrong", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getArtworkById
