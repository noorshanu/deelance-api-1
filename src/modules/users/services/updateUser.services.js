const User = require("../user.model");
const mongoose = require("mongoose");

const updateUserProfile = async (userId, body) => {
  try {
    let filterQuery = { _id: mongoose.Types.ObjectId(userId), active: true };
    if (await User.isUserNameTaken(body.userName)) {
      if (
        await User.findOne({
          _id: mongoose.Types.ObjectId(userId),
          userName: body.userName,
        })
      ) {
        const updatedResult = await User.findOneAndUpdate(filterQuery, body, {
          new: true,
        });
        if (updatedResult) {
          return { data: updatedResult, status: true, code: 200 };
        } else {
          return { data: "User not found", status: false, code: 400 };
        }
      } else {
        return { data: "User Name already taken", status: false, code: 400 };
      }
    }
    const updatedResult = await User.findOneAndUpdate(filterQuery, body, {
      new: true,
    });
    if (updatedResult) {
      return { data: updatedResult, status: true, code: 200 };
    } else {
      return { data: "User not found", status: false, code: 400 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = updateUserProfile;
