const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const addMessage = {
  body: Joi.object().keys({
    roomId: Joi.string().required(),
    recieverId: Joi.string().required(),
    message: Joi.string().required(),
    messageType: Joi.string(),
    assetUrl: Joi.string().allow(''),
    assetMeta: Joi.object()
  }),
}

const getArtworkById = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};



module.exports = {
  addMessage,
  getArtworkById,
}
