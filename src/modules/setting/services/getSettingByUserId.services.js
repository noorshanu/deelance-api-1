const mongoos = require("mongoose");
const SETTING = require("../settting.model");


const getSettingByUserId = async ({userId}) => {
  try {
    let filterQuery = { active: true, userId: mongoos.Types.ObjectId(userId) };

    let result = await SETTING.find(filterQuery);

    if (result) {
      return { data: result, status: true, code: 200 };
    } else {
      return { data: "user Not found ", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = getSettingByUserId;
