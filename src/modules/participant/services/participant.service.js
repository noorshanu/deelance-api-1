const mongoose = require('mongoose');
const PARTICIPANTMODEL = require('../participant.model')


const addParticipant = async (userId, roomId) => {
    try {
      const addResult = await PARTICIPANTMODEL.create({ userId, roomId, active: true });
  
      if (addResult) {
        return { data: addResult, status: true, code: 200 };
      } else {
        return { data: 'Cannot add Participant', status: false, code: 400 };
      }
    } catch (error) {
      return { data: error.message, status: false, code: 500 };
    }
  };
  
  module.exports =  addParticipant ;