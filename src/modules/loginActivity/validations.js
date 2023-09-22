const Joi = require('joi');
const { objectId } = require('../../validations/custom.validation');

const addLoginRecord = {
    body: Joi.object().keys({
        userId: Joi.custom(objectId).required(),
        browser: Joi.string().required(),
        platform: Joi.string().required(),
        location: Joi.string().allow(""),
    }),
};

const getAllLoginActivity = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.object(),
        sort: Joi.object(),
    }),
};
const deleteLoginActivity = {
    params: Joi.object().keys({
        recordId: Joi.custom(objectId).required()
    }),
};

module.exports = {
    addLoginRecord,
   getAllLoginActivity,
   deleteLoginActivity
};