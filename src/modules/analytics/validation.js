const Joi = require('joi');
const {  objectId } = require('../../validations/custom.validation');

const addBuySale = {
    body: Joi.object().keys({
        buyerWallet: Joi.string().required(),
        artworkName: Joi.string().required(),
        contractAddress: Joi.string().required(),
        sellerWallet: Joi.string().required(),
        priceETH: Joi.number().required(),
        priceUSD: Joi.number().allow(""),
        editionNo: Joi.number().required(),
    }),
};


module.exports = {
    addBuySale
};