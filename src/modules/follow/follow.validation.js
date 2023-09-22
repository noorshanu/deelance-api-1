const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const addFollower = {
    body: Joi.object().keys({
        userId: Joi.custom(objectId).required()
    }),
};

const deleteFollower = {
    body: Joi.object().keys({
        userId: Joi.custom(objectId).required()
    }),
};






module.exports = {
    addFollower,
    deleteFollower
    
};