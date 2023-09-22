const Joi = require('joi');
const { password,emailCustom } = require('../../validations/custom.validation');

const register = {
  body: Joi.object().keys({
    wallet: Joi.string().required().messages({
      "string.empty": `Wallet must contain value`,
      "any.required": `Wallet is a required field`
    }),
  }),
};

const signup = {
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`,
    }),
    password: Joi.string().required().custom(password).messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    firstName: Joi.string().required().messages({
      "string.empty": `firstName must contain value`,
      "any.required": `firstName is a required field`
    }),
    lastName: Joi.string().allow(""),
    userName: Joi.string().required().messages({
      "string.empty": `Username must contain value`,
      "any.required": `Username is a required field`
    }),
    wallet:Joi.string().allow(""),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().email().custom(emailCustom).messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be valid mail`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`,
    }),
  }),
};

const adminLogin = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
    password: Joi.string().required().messages({
      "string.empty": `Password must contain value`,
      "any.required": `Password is a required field`
    }),
    
  }),
};

const resetPasswordValidation = {
  body: Joi.object().keys({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const socialLogin = {
  body: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

const resendOTP = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
  }),
};

const forgotPasswordSendOTP = {
  body: Joi.object().keys({
    email: Joi.string().email().required().messages({
      "string.empty": `Email must contain value`,
      "any.required": `Email is a required field`,
      "string.email": `Email must be a valid email`
    }),
  }),
};

const verifyOtp = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    otp:Joi.number().required()
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required().custom(password),
  }),
};

const setNewPassword = {
  body: Joi.object().keys({
    email:Joi.string().email().required(),
    oldpassword: Joi.string().required().custom(password),
    newpassword:Joi.string().required().custom(password),
    cpassword:Joi.string().allow('')
  }),
};
const updatePassword = {
  body: Joi.object().keys({
    token:Joi.string().required().messages({
      "string.empty": `Token must contain value`,
      "any.required": `Token is a required field`,
    }),
    currentPassword: Joi.string().required().custom(password).messages({
      "string.empty": `Current Password must contain value`,
      "any.required": `Current Password is a required field`,
    }),
    newPassword:Joi.string().required().custom(password).messages({
      "string.empty": `New Password must contain value`,
      "any.required": `New Password is a required field`,
    }),
  }),
};


module.exports = {
  register,
  login,
  logout,
  resetPasswordValidation,
  adminLogin,
  signup,
  verifyOtp,
  resendOTP,
  forgotPasswordSendOTP,
  resetPassword,
  setNewPassword,
  updatePassword,
  socialLogin
};
