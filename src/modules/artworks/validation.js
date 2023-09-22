const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const addArtwork = {
    body: Joi.object().keys({
        name: Joi.string().required(),
        desc: Joi.string().allow(''),
        priceType: Joi.number().required(),
        exterLink: Joi.string().allow(''),
        price: Joi.number().required(),
        serviceFee: Joi.number().required(),
        royalty: Joi.number().required(),
        assetUrl: Joi.string().required(),
        assetType: Joi.string().required(),
        totalSupply: Joi.number().required(),
        propsObj: Joi.array().allow()
    }),
};
const updateArtwork = {
    params: ({
        id: Joi.custom(objectId).required(),
    })
};
const getArtworkById = {
    params: ({
        id: Joi.custom(objectId).required(),
    })
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
const list = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.object(),
        sort: Joi.object(),
    }),
};

module.exports = {
    addArtwork,
    updateArtwork,
    list,
    getArtworkById,
    listCategory
};