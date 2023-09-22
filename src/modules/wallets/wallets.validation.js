const Joi = require('joi');
const { password, emailCustom, objectId } = require('../../validations/custom.validation');


const addWallets = {
    query: Joi.object().keys({
        metamaskWallet: Joi.string().allow(),
        coinbaseWallet: Joi.string().allow(),
        butskiWallet: Joi.string().allow(),
        connectWallet: Joi.string().allow(),
      
    }),
};






module.exports = {
    addWallets
};