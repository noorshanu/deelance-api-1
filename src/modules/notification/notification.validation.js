const Joi = require('joi');

const addToNotification = {
    body: Joi.object().keys({
        receiverId: Joi.string().required(),
        type: Joi.string().required(),
        message: Joi.string().required(),
    }),
};

const getNotification = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.object(),
        sort: Joi.object(),
        timeRange: Joi.string(),
        isNoPagination: Joi.string(),
    }),
};

module.exports = {
    addToNotification,
    getNotification
};