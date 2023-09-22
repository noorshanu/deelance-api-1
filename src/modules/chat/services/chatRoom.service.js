const mongoose = require("mongoose");
const CHATROOMMODEL = require("../chatRoom.model");

const addChatRoom = async ({ roomId, userId, participantId }) => {
  try {
    const existingRoom = await CHATROOMMODEL.findOne({$and: [
      { participants: { $elemMatch: { userId: mongoose.Types.ObjectId(userId) } } },
      { participants: { $elemMatch: { userId: mongoose.Types.ObjectId(participantId) } } }
    ] });

    if (existingRoom) {
      /* TODO : FOR NEW PARTICIPANCT IN EXISTING GROUP */
      return { data: existingRoom, status: true, code: 200 };
    } else {
      let participantsArray = [participantId, userId].map(i => { return { userId: mongoose.Types.ObjectId(i), userCount: 0 } })
      // Room with the given roomId does not exist, create a new room
     console.log(participantsArray);
      const addResult = await CHATROOMMODEL.create({
        roomId,
        createdBy: mongoose.Types.ObjectId(userId),
        participants:participantsArray,
      });
      return { data: addResult, status: true, code: 200 };
    }
  } catch (error) {
    return { data: error.message, status: false, code: 500 };
  }
};

module.exports = addChatRoom;
