const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const addCollection = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        token: Joi.string().required(),
        intro: Joi.string().allow(''),
        logo: Joi.string().required(),
        launchDate: Joi.date().allow(),
        categoryId: Joi.custom(objectId).required(),
        createdBy: Joi.custom(objectId).required(),
        contractAddress: Joi.string().allow('')
    }),
};


module.exports = {
    addCollection,
};