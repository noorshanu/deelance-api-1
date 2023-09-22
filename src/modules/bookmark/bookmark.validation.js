const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');

const addBookMark = {
    body: Joi.object().keys({
        artworkId: Joi.custom(objectId).required(),
    }),
};

module.exports = {
    addBookMark,
};