const participantModel = require("../participant.model");
const userModel = require("../../users/user.model");
const Mongoose = require("mongoose");

const getMyRoomParticipants = async (userId) => {
  try {
    const participant = await participantModel.find({ userId });
    console.log("participant1", participant);

    if (!participant) {
      throw new Error("Participant not found.");
    }
    const usrIdarray = participant.map((participant)=> participant.roomId);
    const participants = await participantModel.find({
    roomId: { $in: usrIdarray }, // Find all participants whose roomId is in usrIdarray
  });
  console.log("Participants2:", participants);

    const userIds = participants.map((participant) =>
      Mongoose.Types.ObjectId(participant.userId)
    );
    console.log("userIds :", userIds);

    const users = await userModel.find(
      { _id: { $in: userIds } },
      "firstName lastName"
    );
    console.log("users :", users);

    const result = users.reduce((acc, user) => {
      const roomId = participant.roomId;
      const fullName = `${user.firstName} ${user.lastName}`;
      if (!acc[roomId]) {
        acc[roomId] = [fullName];
      } else {
        acc[roomId].push(fullName);
      }
      console.log("acc :",acc);
      return acc;
    }, {});
    console.log("result :",result);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = getMyRoomParticipants;
