const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const addCategory = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        tag: Joi.string().allow()
    }),
};

const listCategory = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.object(),
        sort: Joi.object(),
        isNoPagination: Joi.string(),
    }),
};

const getCategoryById = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
};



const updateCategory = {
    params: Joi.object().keys({
        id: Joi.custom(objectId).required(),
    }),
    body: Joi.object().keys({
        name: Joi.string().allow(),
        tag: Joi.string().allow()
    }),
};

module.exports = {
    addCategory,
    listCategory,
    getCategoryById,
    updateCategory,
    
};