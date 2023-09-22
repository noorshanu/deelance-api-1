const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');


const list = {
    query: Joi.object().keys({
        page: Joi.number(),
        limit: Joi.number(),
        filter: Joi.object(),
        sort: Joi.object(),
    }),
};

module.exports = {
   
    list,
 
};