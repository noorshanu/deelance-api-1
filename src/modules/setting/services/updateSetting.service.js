const mongoos = require("mongoose");
const SETTING = require("../settting.model");
const user = require("../../users/user.model");


const updateSettings = async ({userId, key, value}) => {
  try {
    let filterQuery = { active: true, userId: mongoos.Types.ObjectId(userId) };
    let updateQuery = {};

 

    if (key == "product") {
      updateQuery["isProductUpload"] = value;
    } else if (key == "sell") {
      updateQuery["isProductSell"] = value;
    } else if (key == "follower") {
      updateQuery["isNewFollower"] = value;
    } else if (key == "level") {
      updateQuery["isLevelUp"] = value;
    } else {
      return {
        data: "Notification field not provided",
        status: false,
        code: 401,
      };
    }

    let toggleRes = await SETTING.updateOne(filterQuery, updateQuery);

    if (toggleRes?.nModified) {
      return { data: "Modified", status: true, code: 200 };
    } else {
      return { data: "user Not found ", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = updateSettings;
