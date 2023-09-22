const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');

const listUsers = {
  query: Joi.object().keys({
    page: Joi.number(),
    limit: Joi.number(),
    filter: Joi.string().allow(''),
    sort: Joi.object(),
  }),
};

const getUserById = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

const updateUser = {
  body: Joi.object().keys({
    name: Joi.string().allow(""),
    profilePic: Joi.string().allow(""),
    nickname: Joi.string().allow(""),
    bio: Joi.string().allow("")
  }),
};

const updateUserStatus = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  })
};

const updateProfile = {
  body: Joi.object().keys({
    firstName: Joi.string().allow(""),
    lastName: Joi.string().allow(""),
    userName: Joi.string().allow(""),
    email: Joi.string().allow(""),
    password: Joi.string().allow(""),
    profilePic: Joi.string().allow(""),
    twitterLink: Joi.string().allow(""),
    isVerified: Joi.boolean().allow(""),
    coverPic: Joi.string().allow(""),
    externalLink: Joi.string().allow(""),
    bio: Joi.string().allow(""),
    wallet: Joi.string().allow(""),
  }),
};
const updateWallet = {
  body: Joi.object().keys({
    wallet: Joi.string().required(),
  }),
};
const deleteProfile = {
  params: Joi.object().keys({
    id: Joi.custom(objectId).required(),
  }),
};

module.exports = {
  listUsers,
  getUserById,
  updateUser,
  updateUserStatus,
  updateProfile,
  deleteProfile,
  updateWallet
};