const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const addAuction = {
  body: Joi.object().keys({
    artworkId: Joi.custom(objectId).required(),
    bidAmount: Joi.number().required(),
    expiryDate: Joi.date(),
    auctionType: Joi.string()
  }),
}

const getArtworkById = {
  params: Joi.object().keys({
      id: Joi.custom(objectId).required(),
  }),
};


module.exports={
  addAuction,
  getArtworkById
}
